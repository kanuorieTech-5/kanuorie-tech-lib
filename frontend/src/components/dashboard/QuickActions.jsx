import { Button } from "../ui";

export default function QuickActions({ actions = [] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {actions.map((action) => (
        <Button key={action.label} onClick={action.onClick}>
          {action.icon}

          {action.label}
        </Button>
      ))}
    </div>
  );
}
