import { faCopy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconButton } from "@app/components/v2";

import { CredentialField } from "./CredentialField";

export const SecureCredentialField = ({
  label,
  value,
  isVisible,
  onToggleVisibility,
  maskPattern = "••••••••",
  onCopy
}: SecureCredentialFieldProps) => (
  <CredentialField label={label} value={isVisible ? value : maskPattern}>
    <IconButton
      onClick={onToggleVisibility}
      variant="plain"
      className="pb-1 text-xs"
      ariaLabel={`toggle ${label.toLowerCase()} visibility`}
    >
      <FontAwesomeIcon icon={isVisible ? faEye : faEyeSlash} />
    </IconButton>
    <IconButton
      variant="plain"
      className="pb-1 text-xs"
      ariaLabel={`copy ${label.toLowerCase()} to clipboard`}
      onClick={onCopy}
    >
      <FontAwesomeIcon icon={faCopy} />
    </IconButton>
  </CredentialField>
);

type SecureCredentialFieldProps = {
  label: string;
  value: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  maskPattern?: string;
  onCopy: () => void;
};
