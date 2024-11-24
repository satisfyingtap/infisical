import { faCreditCard, faFileAlt, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TUserCredential } from "@app/hooks/api/userCredentials/types";

const credentialTypeToIcon = {
  login: faGlobe,
  card: faCreditCard,
  note: faFileAlt
};

const getCardType = (number: string): string => {
  if (number[0] === "4") return "Visa, ";
  if (number[0] === "5") return "Mastercard, ";
  return "";
};

export const UserCredentialsItem = ({
  item,
  isSelected,
  onClick
}: {
  item: TUserCredential;
  isSelected: boolean;
  onClick: (id: string) => void;
}) => {
  return (
    <div
      key={item.id}
      className={`flex h-16 w-full cursor-pointer flex-row items-center gap-2 border-b border-mineshaft-600 px-4 transition-colors duration-300 ${
        isSelected ? "bg-mineshaft-700" : "hover:bg-mineshaft-700"
      }`}
      onClick={() => onClick(item.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(item.id);
        }
      }}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-md p-[4px] transition-colors duration-300 ${
          isSelected ? "bg-primary/5" : "bg-mineshaft-600"
        }`}
      >
        <FontAwesomeIcon
          className={`text-sm ${
            isSelected ? "text-primary" : "text-gray-500"
          } transition-colors duration-300`}
          icon={credentialTypeToIcon[item.type] ?? faFileAlt}
        />
      </div>
      <div className="flex flex-col gap-0">
        <span className="text-sm">{item.name ?? "-"}</span>
        {item.type === "login" && <span className="text-xs text-gray-400">{item.username}</span>}
        {item.type === "card" && (
          <span className="text-xs text-gray-400">{`${getCardType(item.number)}*${item.number.slice(
            -4
          )}`}</span>
        )}
      </div>
    </div>
  );
};
