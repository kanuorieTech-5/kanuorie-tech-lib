import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../services";
import { Card, Button, } from "../components/ui";

export default function ResetPassword() {
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();

  const token = pathToken || searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing or invalid. Please request a new reset link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        password,
      });

      toast.success("Password updated successfully.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-3 text-center text-3xl font-bold">
          Reset Password
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              New Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Enter at least 8 characters"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Update Password
          </Button>
        </form>
      </Card>
    </section>
  );
}