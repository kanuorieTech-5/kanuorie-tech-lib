import clsx from "clsx";

export default function Card({
  children,
  title,
  footer,
  className = "",
  padding = true,
}) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md",
        className
      )}
    >
      {title && (
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
        </div>
      )}

      <div className={padding ? "p-6" : ""}>
        {children}
      </div>

      {footer && (
        <div className="border-t px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}