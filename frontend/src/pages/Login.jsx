import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

import { useAuth } from "../contexts";
// import { loginUser } from "../services";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target }) =>
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(form);

      login(res.user, res.token);

      toast.success("Welcome back!");

      navigate("/");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

      <Card className="w-full max-w-md p-8">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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

          <div className="text-right">

            <Link
              to="/forgot-password"
              className="text-sm text-blue-600"
            >
              Forgot Password?
            </Link>

          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Login
          </Button>

        </form>

        <p className="mt-8 text-center">

          Don't have an account?

          <Link
            to="/register"
            className="ml-2 text-blue-600"
          >
            Register
          </Link>

        </p>

      </Card>

    </section>
  );
}