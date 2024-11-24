import { format } from "date-fns";

type TimestampFieldProps = {
  label: "Created" | "Updated";
  date: Date | string;
};

export const TimestampField = ({ label, date }: TimestampFieldProps) => (
  <div className="flex flex-row gap-1">
    <span className="text-xs font-semibold text-bunker-300">{label}:</span>
    <span className="text-xs text-bunker-300">{format(new Date(date), "dd MMM yyyy, HH:mm")}</span>
  </div>
);
