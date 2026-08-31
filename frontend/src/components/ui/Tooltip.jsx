export default function Tooltip({ text, children }) {
  return (
    <div className="group relative inline-flex">
      {children}

      <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-black px-3 py-2 text-xs text-white group-hover:block">
        {text}
      </div>
    </div>
  );
}
