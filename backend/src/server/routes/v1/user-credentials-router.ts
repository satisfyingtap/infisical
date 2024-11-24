import { z } from "zod";

import { UserCredentialsSchema } from "@app/db/schemas/user-credentials";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";
import {
  TUpdateUserCredentialDTO,
  UserCredentialResponseSchema
} from "@app/services/user-credentials/user-credentials-types";

export const registerUserCredentialsRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      querystring: z.object({
        offset: z.coerce.number().min(0).max(100).default(0),
        limit: z.coerce.number().min(1).max(100).default(25)
      }),
      response: {
        200: z.object({
          credentials: z.array(UserCredentialResponseSchema),
          totalCount: z.number()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { credentials, totalCount } = await req.server.services.userCredentials.getUserCredentials({
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId,
        ...req.query
      });

      return {
        credentials,
        totalCount
      };
    }
  });

  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      body: z.discriminatedUnion("type", [
        z.object({
          type: z.literal("login"),
          name: z.string(),
          url: z.string(),
          username: z.string(),
          password: z.string()
        }),
        z.object({
          type: z.literal("card"),
          name: z.string(),
          cardholderName: z.string(),
          number: z.string(),
          expMonth: z.string(),
          expYear: z.string(),
          code: z.string()
        }),
        z.object({
          type: z.literal("note"),
          name: z.string(),
          content: z.string()
        })
      ]),
      response: {
        200: z.object({
          id: z.string()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const userCredential = await req.server.services.userCredentials.createUserCredential({
        ...req.body,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId
      });

      return { id: userCredential.id };
    }
  });

  // update user credential
  server.route({
    method: "PATCH",
    url: "/:credentialId",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      params: z.object({
        credentialId: z.string()
      }),
      body: UserCredentialsSchema.partial(),
      response: {
        200: z.object({
          id: z.string()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { credentialId } = req.params;
      const updatedCredential = (await req.server.services.userCredentials.updateUserCredentialById({
        ...(req.body as TUpdateUserCredentialDTO),
        id: credentialId,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId
      })) as { id: string };
      return { id: updatedCredential.id };
    }
  });

  // delete user credential
  server.route({
    method: "DELETE",
    url: "/:credentialId",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      params: z.object({
        credentialId: z.string()
      }),
      response: {
        200: z.object({
          id: z.string()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { credentialId } = req.params;
      const deletedCredential = (await req.server.services.userCredentials.deleteUserCredentialById({
        id: credentialId,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId
      })) as { id: string };

      return { id: deletedCredential.id };
    }
  });
};
