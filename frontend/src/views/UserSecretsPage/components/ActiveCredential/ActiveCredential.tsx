import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@app/components/v2";
import { TUserCredential } from "@app/hooks/api/userCredentials/types";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { CardCredential } from "./CardCredentail";
import { CredentialField } from "./CredentialField";
import { LoginCredential } from "./LoginCredential";
import { NoteCredential } from "./NoteCredential";
import { TimestampField } from "./TimestampField";

export const ActiveCredential = ({
  handlePopupOpen,
  credential
}: {
  handlePopupOpen: (
    popUpName: keyof UsePopUpState<["deleteUserCredentialConfirmation" | "updateUserCredential"]>,
    data: { name: string; id: string } | TUserCredential
  ) => void;
  credential: TUserCredential;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 pt-4 pr-4">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-xs font-semibold text-gray-400">Credential Information</h1>
        <div className="flex gap-2">
          <Button
            leftIcon={<FontAwesomeIcon icon={faPencilAlt} />}
            onClick={(e) => {
              e.stopPropagation();
              handlePopupOpen("updateUserCredential", credential);
            }}
            variant="plain"
            colorSchema="secondary"
            className="px-2 text-xs"
          >
            Edit
          </Button>
          <Button
            leftIcon={<FontAwesomeIcon icon={faTrash} />}
            onClick={(e) => {
              e.stopPropagation();
              handlePopupOpen("deleteUserCredentialConfirmation", {
                name: "delete",
                id: credential.id
              });
            }}
            variant="plain"
            colorSchema="secondary"
            className="px-2 text-xs"
            aria-label="delete"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-md bg-mineshaft-700 p-4">
        <CredentialField label="Name" value={credential.name} />

        {credential.type === "login" && (
          <LoginCredential
            url={credential.url}
            username={credential.username}
            password={credential.password}
          />
        )}

        {credential.type === "note" && <NoteCredential content={credential.content} />}

        {credential.type === "card" && (
          <CardCredential
            cardholderName={credential.cardholderName}
            number={credential.number}
            expMonth={credential.expMonth}
            expYear={credential.expYear}
            code={credential.code}
          />
        )}
      </div>
      <div className="flex flex-col gap-[2px] pl-2 pt-2">
        <TimestampField label="Updated" date={credential.updatedAt ?? new Date()} />
        <TimestampField label="Created" date={credential.createdAt ?? new Date()} />
      </div>
    </div>
  );
};
