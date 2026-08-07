import Modal from "./Modal";

export default function LoadingModal({
  isOpen,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title="Loading..."
    >
      <div className="flex justify-center py-8">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

      </div>
    </Modal>
  );
}