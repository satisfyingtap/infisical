import { z } from "zod";

export type TUserCredentialPermission = {
  actorId: string;
  actorOrgId: string;
};

export type TGetUserCredentialsDTO = {
  offset: number;
  limit: number;
} & TUserCredentialPermission;

export type TUpdateUserCredentialDTO = {
  id: string;
} & TCreateUserCredentialDTO;

export type TCreateUserCredentialDTO = {
  type: "login" | "card" | "note";
  name: string;
} & (
  | {
      type: "login";
      url: string;
      username: string;
      password: string;
    }
  | {
      type: "card";
      cardholderName: string;
      number: string;
      expMonth: string;
      expYear: string;
      code: string;
    }
  | {
      type: "note";
      content: string;
    }
) &
  TUserCredentialPermission;

export type TGetActiveUserCredentialByIdDTO = {
  userCredentialId: string;
} & TUserCredentialPermission;

export type TDeleteUserCredentialDTO = {
  id: string;
} & TUserCredentialPermission;

export const UserCredentialResponseSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("login"),
    name: z.string(),
    url: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date(),
    userId: z.string(),
    organizationId: z.string()
  }),
  z.object({
    id: z.string(),
    type: z.literal("card"),
    name: z.string(),
    cardholderName: z.string().optional(),
    number: z.string().optional(),
    expMonth: z.string().optional(),
    expYear: z.string().optional(),
    code: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string(),
    organizationId: z.string()
  }),
  z.object({
    id: z.string(),
    type: z.literal("note"),
    name: z.string(),
    content: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    userId: z.string(),
    organizationId: z.string()
  })
]);

export type TUserCredentialResponse = z.infer<typeof UserCredentialResponseSchema>;
