import { createNotification } from "@app/components/notifications";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const handleCopy = (value: string, fieldName: string) => {
  copyToClipboard(value);
  createNotification({
    text: `Successfully copied ${fieldName} to clipboard`,
    type: "success"
  });
};
