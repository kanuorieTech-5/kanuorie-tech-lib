import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input } from "../ui";

export default function RegisterForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
    <Card className="mx-auto max-w-lg p-8">
      <h2 className="mb-2 text-3xl font-bold">
        Create Account
      </h2>

      <p className="mb-8 text-gray-500">
        Join KanuorieTech Hub today.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
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

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          Register
        </Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </Card>
  );
}