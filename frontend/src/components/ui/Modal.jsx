import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full mx-4",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full rounded-2xl bg-white shadow-2xl dark:bg-slate-900 ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {footer && (
          <div className="border-t p-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}