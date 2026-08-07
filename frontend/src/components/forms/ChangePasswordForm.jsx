import { useState } from "react";
import {
  Button,
  Card,
  Input,
} from "../ui";

export default function ChangePasswordForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const change = ({ target }) =>
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  return (
    <Card className="max-w-lg p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(form);
        }}
        className="space-y-5"
      >
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={change}
          required
        />

        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={change}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={change}
          required
        />

        <Button
          type="submit"
          loading={loading}
        >
          Update Password
        </Button>
      </form>
    </Card>
  );
}