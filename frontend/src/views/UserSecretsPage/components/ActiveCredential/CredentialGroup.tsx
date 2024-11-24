import { ReactNode } from "react";

export const CredentialGroup = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-2">{children}</div>
);
