import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../contexts";
import { register } from "../services";

import {
  Button,
  Card,
  Input,
} from "../components/ui";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({
    target,
  }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    /* ----------------------------------------
       VALIDATION
    ---------------------------------------- */

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      toast.error(
        "Please complete all required fields."
      );

      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }

    if (form.password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * Only send fields the backend expects.
       */
      const registrationData = {
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email.trim().toLowerCase(),

        password: form.password,
      };

      const res =
        await register(
          registrationData
        );

      /*
       * Our ApiResponse structure should
       * return the authentication data under
       * res.data.
       */
      const authData = res?.data;

      if (
        !authData?.token ||
        !authData?.user
      ) {
        throw new Error(
          "Registration succeeded but authentication data was not returned."
        );
      }

      /*
       * Automatically authenticate the
       * newly registered user.
       */
      login(
        authData.user,
        authData.token
      );

      toast.success(
        "Account created successfully!"
      );

      navigate("/");
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join KanuorieTech and start
            learning today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={
              form.confirmPassword
            }
            onChange={handleChange}
            autoComplete="new-password"
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

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 font-medium text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </Card>
    </section>
  );
}
