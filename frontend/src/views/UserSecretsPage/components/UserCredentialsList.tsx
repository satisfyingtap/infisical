import { useState } from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EmptyState } from "@app/components/v2";
import { useGetUserCredentials } from "@app/hooks/api/userCredentials";
import { TUserCredential } from "@app/hooks/api/userCredentials/types";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { ActiveCredential } from "./ActiveCredential/ActiveCredential";
import { UserCredentialsItem } from "./UserCredentialsItem";

type Props = {
  handlePopUpOpen: (
    popUpName: keyof UsePopUpState<["deleteUserCredentialConfirmation" | "updateUserCredential"]>,
    data:
      | {
          name: string;
          id: string;
        }
      | TUserCredential
  ) => void;
};

export const UserCredentialsList = ({ handlePopUpOpen }: Props) => {
  const { isLoading, data } = useGetUserCredentials({
    offset: 0,
    limit: 50
  });

  const [selectedCredentialId, setSelectedCredentialId] = useState<string | null>(null);

  const selectedCredential =
    data?.credentials?.find((credential) => credential.id === selectedCredentialId) ?? null;

  return (
    <div className="flex min-h-[600px] w-full flex-row gap-4 rounded-md border-[1px] border-mineshaft-700 bg-mineshaft-800">
      <div className="flex h-full min-h-[600px] w-full max-w-[300px] flex-col gap-0 border-r border-mineshaft-700">
        {isLoading &&
          ["1", "2", "3", "4"].map((item) => (
            <div
              key={item}
              className="h-16 w-full animate-pulse border-b border-mineshaft-500 px-4 pt-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-mineshaft-600" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-16 rounded bg-mineshaft-600" />
                  <div className="h-3 w-32 rounded bg-mineshaft-600" />
                </div>
              </div>
            </div>
          ))}

        {!isLoading &&
          data?.credentials?.map((item) => (
            <UserCredentialsItem
              key={item.id}
              item={item}
              onClick={setSelectedCredentialId}
              isSelected={selectedCredentialId === item.id}
            />
          ))}
      </div>
      {!isLoading && !data?.credentials?.length && (
        <EmptyState title="No credentials added yet" icon={faKey} />
      )}

      {selectedCredential ? (
        <ActiveCredential handlePopupOpen={handlePopUpOpen} credential={selectedCredential} />
      ) : (
        <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2">
          <FontAwesomeIcon icon={faKey} className="text-4xl text-mineshaft-400" />
          <p className="text-sm text-mineshaft-400">Select a credential to view details</p>
        </div>
      )}
    </div>
  );
};
