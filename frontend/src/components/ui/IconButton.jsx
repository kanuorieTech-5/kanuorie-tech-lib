import Button from "./Button";

export default function IconButton({ icon, ...props }) {
  return (
    <Button {...props} className="aspect-square p-3">
      {icon}
    </Button>
  );
}
