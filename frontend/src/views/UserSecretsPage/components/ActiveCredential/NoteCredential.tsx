import { useEffect, useState } from "react";

import { CredentialGroup } from "./CredentialGroup";
import { SecureCredentialField } from "./SecureCredentialField";
import { handleCopy } from "./utils";

export const NoteCredential = ({ content }: { content: string }) => {
  const [isNoteVisible, setIsNoteVisible] = useState(false);

  useEffect(() => {
    setIsNoteVisible(false);
  }, [content]);

  return (
    <CredentialGroup>
      <SecureCredentialField
        label="Note"
        value={content}
        isVisible={isNoteVisible}
        onToggleVisibility={() => setIsNoteVisible(!isNoteVisible)}
        onCopy={() => {
          handleCopy(content, "note");
        }}
      />
    </CredentialGroup>
  );
};

export default NoteCredential;
