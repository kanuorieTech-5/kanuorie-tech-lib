import clsx from "clsx";

export default function Avatar({
  src,
  alt = "Avatar",
  name = "",
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  };

  if (!src) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white",
          sizes[size],
          className
        )}
      >
        {name
          ? name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        "rounded-full object-cover",
        sizes[size],
        className
      )}
    />
  );
}