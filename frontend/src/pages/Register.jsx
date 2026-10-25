import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../contexts";
import { register } from "../services";
import RegisterForm from "../components/forms/RegisterForm";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const referralCode = (searchParams.get("ref") || "")
    .trim()
    .toUpperCase();

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    if (loading) return;

    if (
      !form.firstName?.trim() ||
      !form.lastName?.trim() ||
      !form.email?.trim() ||
      !form.password
    ) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (!form.confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!form.userType) {
      toast.error("Please select the option that best describes you.");
      return;
    }

    if (!form.interests?.length) {
      toast.error("Please select at least one area of interest.");
      return;
    }

    if (!form.discoverySource) {
      toast.error("Please tell us how you discovered KanuorieTech.");
      return;
    }

    if (
      form.userType === "business_owner" &&
      (!form.businessType || !form.businessNeeds?.length)
    ) {
      toast.error("Add your business type and at least one service need.");
      return;
    }

    try {
      setLoading(true);

      const {
        confirmPassword,
        ...additionalRegistrationData
      } = form;

      const registrationData = {
        ...additionalRegistrationData,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(referralCode ? { referralCode } : {}),
      };

      const res = await register(registrationData);
      const authData = res?.data;

      if (!authData?.token || !authData?.user) {
        throw new Error(
          "Registration succeeded but authentication data was not returned."
        );
      }

      login(authData.user, authData.token);

      toast.success(
        form.userType === "business_owner"
          ? "Account created and business service request sent to our team."
          : "Account created successfully!"
      );

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 px-2 py-2 sm:px-2 sm:py-2 lg:px-2 lg:py-2">
      <div className="">
        <RegisterForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </section>
  );
}
