import clsx from "clsx";

export default function Divider({
  text,
  orientation = "horizontal",
  className = "",
}) {
  if (orientation === "vertical") {
    return (
      <div
        className={clsx(
          "mx-2 h-full min-h-6 w-px bg-gray-200 dark:bg-slate-700",
          className,
        )}
      />
    );
  }

  if (!text) {
    return (
      <hr
        className={clsx(
          "my-6 border-gray-200 dark:border-slate-700",
          className,
        )}
      />
    );
  }

  return (
    <div className={clsx("my-6 flex items-center", className)}>
      <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />

      <span className="mx-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
        {text}
      </span>

      <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
    </div>
  );
}
