import { Modal, ModalContent } from "@app/components/v2";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { CreateUserCredentialForm } from "./CreateUserCredentialForm";

type Props = {
  popUp: UsePopUpState<["createUserCredential"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["createUserCredential"]>,
    state?: boolean
  ) => void;
};

export const CreateUserCredentialModal = ({ popUp, handlePopUpToggle }: Props) => {
  return (
    <Modal
      isOpen={popUp?.createUserCredential?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("createUserCredential", isOpen);
      }}
    >
      <ModalContent
        title="Create a Credential"
        subTitle="Once you create a credential, people in your organization will be able to access it."
      >
        <CreateUserCredentialForm handlePopUpToggle={handlePopUpToggle} />
      </ModalContent>
    </Modal>
  );
};
