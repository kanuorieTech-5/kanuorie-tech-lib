import clsx from "clsx";

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  rounded = true,
  className = "",
}) {
  const variants = {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700",
    dark: "bg-slate-800 text-white",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium",
        variants[variant],
        sizes[size],
        rounded ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      {children}
    </span>
  );
}
