import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "Nothing Found",
  description = "There is currently nothing to display.",
  buttonText,
  onButtonClick,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
      <div className="mb-6 rounded-full bg-blue-100 p-5 text-blue-600">
        <Icon size={42} />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-slate-800">{title}</h2>

      <p className="mb-6 max-w-md text-gray-500">{description}</p>

      {buttonText && <Button onClick={onButtonClick}>{buttonText}</Button>}
    </div>
  );
}
