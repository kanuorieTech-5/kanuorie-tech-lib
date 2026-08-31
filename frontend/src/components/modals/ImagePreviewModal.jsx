import Modal from "./Modal";

export default function ImagePreviewModal({ isOpen, onClose, image }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview" size="max-w-4xl">
      <img src={image} alt="" className="w-full rounded-lg" />
    </Modal>
  );
}
