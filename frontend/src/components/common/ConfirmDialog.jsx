import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button
            loading={loading}
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="leading-7 text-gray-600">{message}</p>
    </Modal>
  );
}
