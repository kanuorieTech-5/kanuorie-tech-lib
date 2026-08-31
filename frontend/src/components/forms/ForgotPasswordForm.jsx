import { useState } from "react";
import { Button, Card, Input } from "../ui";

export default function ForgotPasswordForm({ onSubmit, loading = false }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email });
  };

  return (
    <Card className="mx-auto max-w-md p-8">
      <h2 className="mb-2 text-3xl font-bold">Forgot Password</h2>

      <p className="mb-8 text-gray-500">
        Enter your email to receive a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" loading={loading} fullWidth>
          Send Reset Link
        </Button>
      </form>
    </Card>
  );
}
