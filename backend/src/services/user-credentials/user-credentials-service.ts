import { z } from "zod";

import { TUserCredentials } from "@app/db/schemas/user-credentials";
import { BadRequestError, ForbiddenRequestError, NotFoundError } from "@app/lib/errors";

import { TKmsServiceFactory } from "../kms/kms-service";
import { TUserCredentialsDALFactory } from "./user-credentials-dal";
import {
  TCreateUserCredentialDTO,
  TDeleteUserCredentialDTO,
  TGetActiveUserCredentialByIdDTO,
  TGetUserCredentialsDTO,
  TUpdateUserCredentialDTO,
  TUserCredentialResponse
} from "./user-credentials-types";

type TUserCredentialsServiceFactoryDep = {
  userCredentialsDAL: TUserCredentialsDALFactory;
  kmsService: TKmsServiceFactory;
};

export type TUserCredentialsServiceFactory = ReturnType<typeof userCredentialsServiceFactory>;

const isUuidV4 = (uuid: string) => z.string().uuid().safeParse(uuid).success;

export const userCredentialsServiceFactory = ({
  userCredentialsDAL,
  kmsService
}: TUserCredentialsServiceFactoryDep) => {
  const createUserCredential = async ({ type, name, actorId, actorOrgId, ...data }: TCreateUserCredentialDTO) => {
    if (!actorId) throw new ForbiddenRequestError();
    if (!actorOrgId) throw new ForbiddenRequestError();

    const secretValue = JSON.stringify({
      ...data
    });

    if (secretValue.length > 10_000) {
      throw new BadRequestError({ message: "Shared secret value too long" });
    }
    const encryptWithRoot = kmsService.encryptWithRootKey();
    const encryptedSecret = encryptWithRoot(Buffer.from(secretValue));

    const newUserCredential = await userCredentialsDAL.createUserCredential({
      type,
      name,
      userId: actorId,
      organizationId: actorOrgId,
      encryptedData: encryptedSecret.toString("hex")
    });

    if (!newUserCredential) {
      throw new Error("User credential not found");
    }

    return { id: newUserCredential.id };
  };

  const getUserCredentials = async ({ offset, limit, actorId, actorOrgId }: TGetUserCredentialsDTO) => {
    if (!actorId) throw new ForbiddenRequestError();
    if (!actorOrgId) throw new ForbiddenRequestError();

    const credentials = await userCredentialsDAL.find(
      {
        userId: actorId,
        organizationId: actorOrgId
      },
      { offset, limit, sort: [["createdAt", "desc"]] }
    );

    const count = await userCredentialsDAL.countAllUserOrgCredentials({
      actorId,
      actorOrgId
    });

    const decryptedCredentials = await Promise.all(
      credentials.map(async (credential: TUserCredentials) => {
        let decryptedData: Record<string, unknown> = {};
        if (credential.encryptedData) {
          const decryptWithRoot = kmsService.decryptWithRootKey();
          const decryptedBuffer = decryptWithRoot(Buffer.from(credential.encryptedData, "hex"));
          decryptedData = JSON.parse(decryptedBuffer.toString()) as Record<string, unknown>;
        }

        const baseCredential = {
          id: credential.id,
          type: credential.type as "login" | "card" | "note",
          name: credential.name,
          createdAt: credential.createdAt,
          updatedAt: credential.updatedAt,
          userId: credential.userId,
          organizationId: credential.organizationId
        };

        switch (credential.type) {
          case "login":
            return {
              ...baseCredential,

              url: decryptedData.url as string,
              username: decryptedData.username as string,
              password: decryptedData.password as string
            };
          case "card":
            return {
              ...baseCredential,

              cardholderName: decryptedData.cardholderName as string,
              number: decryptedData.number as string,
              expMonth: decryptedData.expMonth as string,
              expYear: decryptedData.expYear as string,
              code: decryptedData.code as string
            };
          case "note":
            return {
              ...baseCredential,
              content: decryptedData.content as string
            };
          default:
            return baseCredential;
        }
      })
    );

    return {
      credentials: decryptedCredentials as TUserCredentialResponse[],
      totalCount: count
    };
  };

  const updateUserCredentialById = async ({
    id,
    type,
    name,
    actorId,
    actorOrgId,
    ...data
  }: TUpdateUserCredentialDTO) => {
    if (!isUuidV4(id)) throw new BadRequestError({ message: "Invalid user credential ID" });
    if (!actorId) throw new ForbiddenRequestError();
    if (!actorOrgId) throw new ForbiddenRequestError();

    const userCredential = await userCredentialsDAL.findActiveCredential({
      id
    });

    if (!userCredential)
      throw new NotFoundError({
        message: `User credential with ID '${id}' not found`
      });

    if (userCredential.userId !== actorId) throw new ForbiddenRequestError();

    const secretValue = JSON.stringify({
      ...data
    });

    if (secretValue.length > 10_000) {
      throw new BadRequestError({ message: "Shared secret value too long" });
    }
    const encryptWithRoot = kmsService.encryptWithRootKey();
    const encryptedSecret = encryptWithRoot(Buffer.from(secretValue));

    return userCredentialsDAL.updateById(id, {
      type,
      name,
      encryptedData: encryptedSecret.toString("hex"),
      updatedAt: new Date()
    });
  };

  const getUserCredentialById = async ({ userCredentialId, actorId, actorOrgId }: TGetActiveUserCredentialByIdDTO) => {
    if (!isUuidV4(userCredentialId)) throw new BadRequestError({ message: "Invalid user credential ID" });
    if (!actorId) throw new ForbiddenRequestError();
    if (!actorOrgId) throw new ForbiddenRequestError();

    const userCredential = await userCredentialsDAL.findActiveCredential({
      id: userCredentialId
    });

    if (!userCredential)
      throw new NotFoundError({
        message: `User credential with ID '${userCredentialId}' not found`
      });

    if (userCredential.userId !== actorId) throw new ForbiddenRequestError();

    let decryptedData = {};
    if (userCredential.encryptedData) {
      const decryptWithRoot = kmsService.decryptWithRootKey();
      const decryptedBuffer = decryptWithRoot(Buffer.from(userCredential.encryptedData, "hex"));
      decryptedData = JSON.parse(decryptedBuffer.toString()) as Record<string, unknown>;
    }

    return {
      ...userCredential,
      ...decryptedData
    };
  };

  const deleteUserCredentialById = async ({
    id,
    actorId,
    actorOrgId
  }: TDeleteUserCredentialDTO): Promise<{ id: string }> => {
    if (!isUuidV4(id)) throw new BadRequestError({ message: "Invalid user credential ID" });
    if (!actorId) throw new ForbiddenRequestError();
    if (!actorOrgId) throw new ForbiddenRequestError();

    const userCredential = await userCredentialsDAL.findActiveCredential({
      id
    });

    if (!userCredential)
      throw new NotFoundError({
        message: `User credential with ID '${id}' not found`
      });

    if (userCredential.userId !== actorId) throw new ForbiddenRequestError();

    await userCredentialsDAL.deleteById(id);

    return { id };
  };

  return {
    createUserCredential,
    updateUserCredentialById,
    getUserCredentials,
    getUserCredentialById,
    deleteUserCredentialById
  };
};
