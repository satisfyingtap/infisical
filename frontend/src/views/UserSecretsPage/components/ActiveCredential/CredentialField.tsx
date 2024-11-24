type CredentialFieldProps = {
  label: string;
  value: string;
  children?: React.ReactNode;
};

export const CredentialField = ({ label, value, children }: CredentialFieldProps) => (
  <div className="flex flex-col gap-0">
    <span className="text-sm font-light text-bunker-300">{label}</span>
    <div className="flex flex-row gap-2">
      <span className="text-sm">{value}</span>
      {children}
    </div>
  </div>
);
