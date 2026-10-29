import Spinner from "./Spinner";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Spinner size={36} />

      <p className="text-sm text-gray-500 dark:text-slate-400">{text}</p>
    </div>
  );
}
