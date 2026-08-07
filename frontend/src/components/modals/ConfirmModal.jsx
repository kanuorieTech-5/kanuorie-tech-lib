import Modal from "./Modal";
import { Button } from "../ui";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <p>{message}</p>

      <div className="mt-6 flex justify-end gap-3">

        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
        >
          Confirm
        </Button>

      </div>

    </Modal>
  );
}