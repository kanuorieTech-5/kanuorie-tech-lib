import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui";

export default function ErrorModal({
  isOpen,
  onClose,
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Error"
    >
      <div className="text-center">

        <AlertTriangle
          size={60}
          className="mx-auto text-red-500"
        />

        <p className="mt-4">{message}</p>

        <Button
          className="mt-6"
          onClick={onClose}
        >
          Close
        </Button>

      </div>
    </Modal>
  );
}