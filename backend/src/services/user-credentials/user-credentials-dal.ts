import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { TUserCredentials } from "@app/db/schemas/user-credentials";
import { DatabaseError } from "@app/lib/errors";
import { ormify, selectAllTableCols } from "@app/lib/knex";

export type TUserCredentialsDALFactory = ReturnType<typeof userCredentialsDALFactory>;

export const userCredentialsDALFactory = (db: TDbClient) => {
  const userCredentialsOrm = ormify(db, TableName.UserCredentials);

  const countAllUserOrgCredentials = async ({ actorId, actorOrgId }: { actorId: string; actorOrgId: string }) => {
    try {
      interface CountResult {
        count: string;
      }

      const count = await db
        .replicaNode()(TableName.UserCredentials)
        .where(`${TableName.UserCredentials}.userId`, actorId)
        .where(`${TableName.UserCredentials}.organizationId`, actorOrgId)
        .count("*")
        .first();

      return parseInt((count as unknown as CountResult).count || "0", 10);
    } catch (error) {
      throw new DatabaseError({ error, name: "Count all user-org credentials" });
    }
  };

  const createUserCredential = async (data: Partial<TUserCredentials>, tx?: Knex) => {
    try {
      const [userCredential] = await (tx || db)<TUserCredentials>(TableName.UserCredentials)
        .insert({ ...data, createdAt: new Date(), updatedAt: new Date() })
        .returning("*");
      return userCredential;
    } catch (error) {
      throw new DatabaseError({ error, name: "Create user credential" });
    }
  };

  const findActiveCredential = async (
    filters: Partial<TUserCredentials>,
    tx?: Knex
  ): Promise<TUserCredentials | undefined> => {
    try {
      return await (tx || db)<TUserCredentials>(TableName.UserCredentials).where(filters).first();
    } catch (error) {
      throw new DatabaseError({ error, name: "Find Active Credential" });
    }
  };

  const findActiveCredentials = async (filters: Partial<TUserCredentials>, tx?: Knex): Promise<TUserCredentials[]> => {
    try {
      return await (tx || db)(TableName.UserCredentials)
        .where(filters)
        .select(selectAllTableCols(TableName.UserCredentials));
    } catch (error) {
      throw new DatabaseError({
        error,
        name: "Find Active Credentials"
      });
    }
  };

  const deleteById = async (id: string) => {
    try {
      await userCredentialsOrm.deleteById(id);
    } catch (error) {
      throw new DatabaseError({
        error,
        name: "Delete User Credential"
      });
    }
  };

  return {
    ...userCredentialsOrm,
    createUserCredential,
    countAllUserOrgCredentials,
    deleteById,
    findActiveCredential,
    findActiveCredentials
  };
};
