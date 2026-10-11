import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../contexts";
import LoginForm from "../components/forms/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    if (loading) return;

    if (!form.email?.trim() || !form.password) {
      toast.error("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      toast.success("Welcome back!");

      const from = location.state?.from;

      const redirectPath = from?.pathname
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <LoginForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </section>
  );
}