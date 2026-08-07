import Modal from "./Modal";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui";

export default function SuccessModal({
  isOpen,
  onClose,
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Success"
    >
      <div className="text-center">

        <CheckCircle
          size={60}
          className="mx-auto text-green-500"
        />

        <p className="mt-4">{message}</p>

        <Button
          className="mt-6"
          onClick={onClose}
        >
          OK
        </Button>

      </div>
    </Modal>
  );
}