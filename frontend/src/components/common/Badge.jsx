const variants = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",

  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  danger: "bg-red-500/10 text-red-400 border-red-500/20",

  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",

  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",

  gray: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function Badge({ children, color = "info", className = "" }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-4
        py-1.5
        text-xs
        font-semibold
        tracking-wide
        ${variants[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
