import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { userCredentialsKeys } from "./queries";
import {
  TCreateUserCredentialRequest,
  TDeleteUserCredentialRequest,
  TUpdateUserCredentialRequest,
  TUserCredential
} from "./types";

export const useCreateUserCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inputData: TCreateUserCredentialRequest) => {
      const { data } = await apiRequest.post<TUserCredential>(
        "/api/v1/user-credentials",
        inputData
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(userCredentialsKeys.all())
  });
};

export const useUpdateUserCredential = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inputData: TUpdateUserCredentialRequest) => {
      const { data } = await apiRequest.patch<TUserCredential>(
        `/api/v1/user-credentials/${inputData.id}`,
        inputData
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(userCredentialsKeys.all())
  });
};

export const useDeleteUserCredential = () => {
  const queryClient = useQueryClient();
  return useMutation<TUserCredential, { message: string }, { id: string }>({
    mutationFn: async ({ id }: TDeleteUserCredentialRequest) => {
      const { data } = await apiRequest.delete<TUserCredential>(`/api/v1/user-credentials/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(userCredentialsKeys.all())
  });
};
