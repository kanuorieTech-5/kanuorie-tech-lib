import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input } from "../ui";

export default function LoginForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      <h2 className="mb-2 text-3xl font-bold">
        Welcome Back
      </h2>

      <p className="mb-8 text-gray-500">
        Sign in to your account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          Login
        </Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600"
          >
            Register
          </Link>
        </p>
      </form>
    </Card>
  );
}