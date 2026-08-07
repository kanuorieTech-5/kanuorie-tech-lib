import ConfirmModal from "./ConfirmModal";

export default function DeleteModal(props) {
  return (
    <ConfirmModal
      {...props}
      title="Delete Item"
      message="This action cannot be undone. Are you sure?"
    />
  );
}