import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../contexts";
import { Button, Card, Input } from "../components/ui";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({ target }) =>
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      await registerUser(form);

      toast.success(
        "Registration successful. Please verify your email."
      );

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <Card className="w-full max-w-lg p-8">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="grid gap-4 md:grid-cols-2">

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

          </div>

          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            loading={loading}
            fullWidth
          >
            Create Account
          </Button>

        </form>

        <p className="mt-8 text-center">

          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-blue-600"
          >
            Login
          </Link>

        </p>

      </Card>
    </section>
  );
}