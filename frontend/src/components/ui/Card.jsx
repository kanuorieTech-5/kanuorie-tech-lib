import clsx from "clsx";

export default function Card({
  children,
  className = "",
  hover = true,
  shadow = "md",
  padding = "p-6",
  rounded = "rounded-2xl",
  border = true,
  glass = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        rounded,
        padding,
        {
          "border border-gray-200 dark:border-gray-700": border,
          "shadow-sm": shadow === "sm",
          "shadow-md": shadow === "md",
          "shadow-lg": shadow === "lg",
          "hover:-translate-y-1 hover:shadow-xl transition-all duration-300":
            hover,
          "bg-white dark:bg-slate-900": !glass,
          "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md": glass,
          "cursor-pointer": onClick,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Sub Components ---------- */

export function CardHeader({ children, className = "" }) {
  return <div className={clsx("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={clsx(
        "text-xl font-bold text-slate-900 dark:text-white",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p
      className={clsx(
        "mt-2 text-sm text-gray-600 dark:text-gray-400",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={clsx("mt-6 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}
