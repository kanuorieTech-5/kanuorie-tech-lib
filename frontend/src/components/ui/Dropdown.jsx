import { useState } from "react";

export default function Dropdown({
  trigger,
  children,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg dark:bg-slate-900">
          {children}
        </div>
      )}
    </div>
  );
}