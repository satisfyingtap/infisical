import { Modal, ModalContent } from "@app/components/v2";
import { TUserCredential } from "@app/hooks/api/userCredentials/types";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { UpdateUserCredentialForm } from "./UpdateUserCredentialForm";

type Props = {
  popUp: UsePopUpState<["updateUserCredential"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["updateUserCredential"]>,
    state?: boolean
  ) => void;
};

export const UpdateUserCredentialModal = ({ popUp, handlePopUpToggle }: Props) => {
  return (
    <Modal
      isOpen={popUp?.updateUserCredential?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("updateUserCredential", isOpen);
      }}
    >
      <ModalContent
        title="Update a Credential"
        subTitle="Update the credential information to keep it up to date."
      >
        <UpdateUserCredentialForm
          handlePopUpToggle={handlePopUpToggle}
          initialData={popUp?.updateUserCredential?.data as TUserCredential}
        />
      </ModalContent>
    </Modal>
  );
};
