import { useState } from "react";
import {
  Button,
  Card,
} from "../ui";

export default function UploadAvatarForm({
  onSubmit,
  loading = false,
}) {
  const [file, setFile] = useState(null);

  const submit = (e) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    onSubmit?.(formData);
  };

  return (
    <Card className="max-w-md p-8">
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <Button
          type="submit"
          loading={loading}
        >
          Upload Avatar
        </Button>
      </form>
    </Card>
  );
}