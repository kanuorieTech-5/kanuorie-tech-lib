import Modal from "./Modal";

export default function FormModal({ isOpen, onClose, title, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="max-w-2xl">
      {children}
    </Modal>
  );
}
