import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import { Button, Card, Input } from "../ui";

export default function LoginForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (loading) return;

    onSubmit?.({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  };

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
          <LogIn size={26} aria-hidden="true" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-3 leading-6 text-slate-500">
          Sign in to continue learning, explore resources, and access your
          KanuorieTech dashboard.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="Email Address"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter your password"
              showPasswordToggle={false}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-9 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              to="/ForgotPassword"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <Button type="submit" loading={loading} fullWidth>
          Sign In
        </Button>

        {/* REGISTER */}
        <p className="pt-2 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Create an Account
          </Link>
        </p>
      </form>

      {/* FOOTER */}
      <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
        <LockKeyhole size={14} aria-hidden="true" />
        Your account is protected by secure authentication.
      </div>
    </Card>
  );
}