import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../services";
import { Card, Input, Button } from "../components/common";

export default function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await resetPassword(token, password);

      toast.success("Password updated.");

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Password reset failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

      <Card className="w-full max-w-md p-8">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Reset Password
        </h1>

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            loading={loading}
            fullWidth
          >
            Update Password
          </Button>

        </form>

      </Card>

    </section>

  );

}