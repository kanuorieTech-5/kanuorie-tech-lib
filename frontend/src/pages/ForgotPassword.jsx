import { useState } from "react";
import toast from "react-hot-toast";

import { forgotPassword } from "../services";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async ({ email }) => {
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);
      setSubmittedEmail(normalizedEmail);

      await forgotPassword(normalizedEmail);

      setSuccess(true);
      toast.success("Password reset request submitted.");
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <ForgotPasswordForm
          key={success ? "success" : "form"}
          onSubmit={handleSubmit}
          loading={loading}
          success={success}
          initialEmail={submittedEmail}
        />

        {success && (
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-4 w-full text-center text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Try another email address
          </button>
        )}
      </div>
    </section>
  );
}
