import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck,} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { useAuth } from "../contexts";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login: authenticate } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ==========================================
     HANDLE FORM CHANGE
  ========================================== */

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ==========================================
     VALIDATION
  ========================================== */

  const validateForm = () => {
    const nextErrors = {};

    const email = form.email.trim();

    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* ==========================================
     SUBMIT
  ========================================== */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await authenticate({
        email: form.email.trim(),
        password: form.password,
      });

      toast.success("Welcome back!");

      const redirectTo =
        location.state?.from?.pathname || "/";

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={28} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-slate-500">
            Sign in to continue to your KanuorieTech account.
          </p>

        </div>

        {/* ==========================================
            LOGIN CARD
        ========================================== */}

        <Card className="p-6 shadow-xl shadow-slate-200/50 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >

            {/* EMAIL */}

            <div>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />

              {errors.email && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>

              <div className="relative">

                <Input
                  label="Password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-[38px] flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.password}
                </p>
              )}

            </div>

            {/* FORGOT PASSWORD */}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SUBMIT */}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {!loading && (
                <ArrowRight
                  size={18}
                  className="mr-2"
                />
              )}

              {loading
                ? "Signing In..."
                : "Sign In"}
            </Button>

          </form>

          {/* DIVIDER */}

          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              New here?
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

          {/* REGISTER */}

          <Link to="/register">
            <Button
              variant="outline"
              fullWidth
              disabled={loading}
            >
              Create an Account
            </Button>
          </Link>

        </Card>

        {/* SECURITY */}

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <LockKeyhole size={14} />

          <span>
            Your account information is securely protected.
          </span>
        </div>

      </div>
    </section>
  );
}