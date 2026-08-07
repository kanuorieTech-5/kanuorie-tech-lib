import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred.",
  retryText = "Try Again",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-8 py-16 text-center">

      <div className="mb-6 rounded-full bg-red-100 p-5 text-red-600">
        <AlertTriangle size={42} />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-red-700">
        {title}
      </h2>

      <p className="mb-6 max-w-lg text-red-600">
        {description}
      </p>

      {onRetry && (
        <Button
          variant="danger"
          onClick={onRetry}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}