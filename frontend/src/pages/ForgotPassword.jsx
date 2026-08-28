import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "../services";
import { Card, Button } from "../components/common";
import { Input } from "../components/ui"

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await forgotPassword(email);

      toast.success("Password reset link sent.");

      setEmail("");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to send reset email."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

      <Card className="w-full max-w-md p-8">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Forgot Password
        </h1>

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            loading={loading}
            fullWidth
          >
            Send Reset Link
          </Button>

        </form>

      </Card>

    </section>

  );

}