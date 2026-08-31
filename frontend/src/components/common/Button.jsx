import clsx from "clsx";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",

    secondary: "bg-slate-700 text-white hover:bg-slate-800",

    outline: "border border-gray-300 hover:bg-gray-100",

    success: "bg-green-600 text-white hover:bg-green-700",

    danger: "bg-red-600 text-white hover:bg-red-700",

    ghost: "hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-5 py-2.5",

    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "rounded-lg font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
