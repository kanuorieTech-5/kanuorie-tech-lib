import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  Send,
} from "lucide-react";

import { Button, Card, Input } from "../ui";

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
  success = false,
  initialEmail = "",
}) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (loading) return;

    onSubmit?.({ email: normalizedEmail });
  };

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xl shadow-slate-200/50 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
          {success ? (
            <CheckCircle2 size={27} aria-hidden="true" />
          ) : (
            <KeyRound size={27} aria-hidden="true" />
          )}
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Account Recovery
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {success ? "Check Your Email" : "Forgot Password?"}
        </h2>

        <p className="mt-3 leading-6 text-slate-500 dark:text-slate-400">
          {success
            ? "If an account exists for the email address you entered, you should receive instructions to reset your password."
            : "Forgot your password? It happens. Enter the email address associated with your KanuorieTech account and we'll help you get back in."}
        </p>
      </div>

      {success ? (
        <div className="space-y-5">
          <div
            role="status"
            className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <Mail
              size={21}
              className="mt-0.5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />

            <div>
              <p className="font-semibold text-emerald-900">
                Reset instructions requested
              </p>
              <p className="mt-1 break-all text-sm text-emerald-800">
                {email.trim().toLowerCase()}
              </p>
              <p className="mt-2 text-sm leading-5 text-emerald-800">
                Check your inbox and spam folder. Follow the instructions in
                the email if it arrives.
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <Input
              label="Email Address"
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              autoComplete="email"
              placeholder="you@example.com"
            />

            {error && (
              <p
                role="alert"
                className="mt-2 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}
          </div>

          <Button type="submit" loading={loading} fullWidth>
            <span className="inline-flex items-center justify-center gap-2">
              <Send size={17} aria-hidden="true" />
              {loading ? "Sending Instructions..." : "Send Reset Link"}
            </span>
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 pt-1 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Login
          </Link>
        </form>
      )}

      {/* Security note */}
      <div className="mt-8 flex items-start justify-center gap-2 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400">
        <LockKeyhole
          size={15}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />
        Your account security matters. Password reset instructions should only
        be sent through your configured account recovery process.
      </div>
    </Card>
  );
}