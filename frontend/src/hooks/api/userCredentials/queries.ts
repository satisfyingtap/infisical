import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { TUserCredential } from "./types";

export const userCredentialsKeys = {
  all: () => ["userCredentials"] as const,
  specificUserCredentials: ({ offset, limit }: { offset: number; limit: number }) =>
    [...userCredentialsKeys.all(), { offset, limit }] as const,
  id: (id: string) => ["userCredentials", id]
};

export const useGetUserCredentials = ({
  offset = 0,
  limit = 25
}: {
  offset: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: userCredentialsKeys.specificUserCredentials({ offset, limit }),
    queryFn: async () => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit)
      });

      const { data } = await apiRequest.get<{ credentials: TUserCredential[]; totalCount: number }>(
        "/api/v1/user-credentials",
        {
          params
        }
      );
      return data;
    }
  });
};
