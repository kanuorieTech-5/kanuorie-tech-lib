import clsx from "clsx";

export default function Alert({ children, variant = "info" }) {
  const variants = {
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <div className={clsx("rounded-xl p-4", variants[variant])}>{children}</div>
  );
}
