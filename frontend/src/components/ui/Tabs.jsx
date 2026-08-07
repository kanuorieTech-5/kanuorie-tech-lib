import { useState } from "react";

export default function Tabs({
  tabs,
}) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="flex gap-2 border-b">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() =>
              setActive(index)
            }
            className={`px-5 py-3 ${
              active === index
                ? "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {tabs[active].content}
      </div>
    </>
  );
}