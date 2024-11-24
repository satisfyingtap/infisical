import { useEffect, useState } from "react";
import { faCopy, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconButton } from "@app/components/v2";

import { CredentialField } from "./CredentialField";
import { CredentialGroup } from "./CredentialGroup";
import { SecureCredentialField } from "./SecureCredentialField";
import { handleCopy } from "./utils";

export const LoginCredential = ({
  url,
  username,
  password
}: {
  url: string;
  username: string;
  password: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    setIsPasswordVisible(false);
  }, [url, username, password]);

  return (
    <CredentialGroup>
      <CredentialField label="URL" value={url}>
        <IconButton
          onClick={() => {
            const urlToOpen = url.startsWith("http") ? url : `https://${url}`;
            window.open(urlToOpen, "_blank");
          }}
          variant="plain"
          ariaLabel="open url in new tab"
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </IconButton>
      </CredentialField>
      <CredentialField label="Username" value={username}>
        <IconButton
          onClick={() => {
            handleCopy(username, "username");
          }}
          variant="plain"
          ariaLabel="copy username to clipboard"
        >
          <FontAwesomeIcon icon={faCopy} />
        </IconButton>
      </CredentialField>

      <SecureCredentialField
        label="Password"
        value={password}
        isVisible={isPasswordVisible}
        onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
        onCopy={() => {
          handleCopy(password, "password");
        }}
      />
    </CredentialGroup>
  );
};
