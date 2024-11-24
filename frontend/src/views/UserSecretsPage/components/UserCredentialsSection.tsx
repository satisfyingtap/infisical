import Head from "next/head";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createNotification } from "@app/components/notifications";
import { Button, DeleteActionModal } from "@app/components/v2";
import { usePopUp } from "@app/hooks";
import { useDeleteUserCredential } from "@app/hooks/api/userCredentials";

import { CreateUserCredentialModal } from "./CreateUserCredentialModal";
import { UpdateUserCredentialModal } from "./UpdateUserCredentialModal";
import { UserCredentialsList } from "./UserCredentialsList";

type DeleteModalData = { name: string; id: string };

export const UserCredentialsSection = () => {
  const deleteUserCredential = useDeleteUserCredential();
  const { popUp, handlePopUpToggle, handlePopUpClose, handlePopUpOpen } = usePopUp([
    "createUserCredential",
    "updateUserCredential",
    "deleteUserCredentialConfirmation"
  ] as const);

  const onDeleteApproved = async () => {
    try {
      deleteUserCredential.mutateAsync({
        id: (popUp?.deleteUserCredentialConfirmation?.data as DeleteModalData)?.id
      });
      createNotification({
        text: "Successfully deleted user credential",
        type: "success"
      });

      handlePopUpClose("deleteUserCredentialConfirmation");
    } catch (err) {
      console.error(err);
      createNotification({
        text: "Failed to delete user credential",
        type: "error"
      });
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-mineshaft-600 bg-mineshaft-900 p-4">
      <Head>
        <title>User Credentials</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/message.png" />
      </Head>
      <div className="mb-4 flex justify-between">
        <p className="text-xl font-semibold text-mineshaft-100">User Credentials</p>
        <Button
          colorSchema="primary"
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            handlePopUpOpen("createUserCredential");
          }}
        >
          Create Credential
        </Button>
      </div>
      <UserCredentialsList handlePopUpOpen={handlePopUpOpen} />
      <CreateUserCredentialModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
      <UpdateUserCredentialModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
      <DeleteActionModal
        isOpen={popUp.deleteUserCredentialConfirmation.isOpen}
        title={`Delete ${
          (popUp?.deleteUserCredentialConfirmation?.data as DeleteModalData)?.name || " "
        } user credential?`}
        onChange={(isOpen) => handlePopUpToggle("deleteUserCredentialConfirmation", isOpen)}
        deleteKey={(popUp?.deleteUserCredentialConfirmation?.data as DeleteModalData)?.name}
        onClose={() => handlePopUpClose("deleteUserCredentialConfirmation")}
        onDeleteApproved={onDeleteApproved}
      />
    </div>
  );
};
