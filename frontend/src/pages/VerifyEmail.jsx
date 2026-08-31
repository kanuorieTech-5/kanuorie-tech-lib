import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyEmail } from "../services";
import { Loader } from "../components/common";

export default function VerifyEmail() {
  const { token } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);

        toast.success("Email verified successfully.");

        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Verification failed.");
      }
    };

    verify();
  }, [token, navigate]);

  return <Loader />;
}
