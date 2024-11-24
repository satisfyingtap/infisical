import { useState } from "react";

import { CredentialField } from "./CredentialField";
import { CredentialGroup } from "./CredentialGroup";
import { SecureCredentialField } from "./SecureCredentialField";
import { handleCopy } from "./utils";

export const CardCredential = ({
  cardholderName,
  number,
  expMonth,
  expYear,
  code
}: {
  cardholderName: string;
  number: string;
  expMonth: string;
  expYear: string;
  code: string;
}) => {
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);
  const [isCardCodeVisible, setIsCardCodeVisible] = useState(false);

  return (
    <CredentialGroup>
      <CredentialField label="Cardholder Name" value={cardholderName} />

      <SecureCredentialField
        label="Card Number"
        value={number}
        isVisible={isCardNumberVisible}
        onToggleVisibility={() => setIsCardNumberVisible(!isCardNumberVisible)}
        maskPattern="•••• •••• •••• ••••"
        onCopy={() => {
          handleCopy(number, "card number");
        }}
      />

      <CredentialField label="Expiration Date" value={`${expMonth}/${expYear}`} />

      <SecureCredentialField
        label="Security Code"
        value={code}
        isVisible={isCardCodeVisible}
        onToggleVisibility={() => setIsCardCodeVisible(!isCardCodeVisible)}
        maskPattern="•••"
        onCopy={() => {
          handleCopy(code, "card code");
        }}
      />
    </CredentialGroup>
  );
};
