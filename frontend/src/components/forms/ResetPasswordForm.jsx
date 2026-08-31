import { useState } from "react";
import { Button, Card, Input } from "../ui";

export default function ResetPasswordForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <Card className="mx-auto max-w-md p-8">
      <h2 className="mb-2 text-3xl font-bold">Reset Password</h2>

      <p className="mb-8 text-gray-500">Enter your new password.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="New Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" loading={loading} fullWidth>
          Reset Password
        </Button>
      </form>
    </Card>
  );
}
