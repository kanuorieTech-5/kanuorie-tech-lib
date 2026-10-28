import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button, Card } from "../components/common";
import { verifyPaystackPayment } from "../services";

const getApiMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

export default function PaystackCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "We're securely verifying your payment with Paystack.",
  );

  useEffect(() => {
    let mounted = true;

    const verifyPayment = async () => {
      const reference =
        searchParams.get("reference") ||
        searchParams.get("trxref");

      if (!reference) {
        if (!mounted) return;

        setStatus("error");
        setMessage(
          "No Paystack payment reference was found. We could not verify this transaction.",
        );
        return;
      }

      try {
        setStatus("verifying");
        setMessage(
          "We're securely verifying your payment with Paystack.",
        );

        const response = await verifyPaystackPayment(reference);

        if (!mounted) return;

        const order = response?.data?.order;

        const courseItem = Array.isArray(order?.items)
          ? order.items.find(
              (item) => item?.itemType === "course",
            )
          : null;

        const courseId = courseItem?.itemId;

        setStatus("success");
        setMessage(
          courseId
            ? "Payment verified successfully. Your course access is being activated."
            : "Payment verified successfully. Your order is now marked as paid.",
        );

        toast.success(
          courseId
            ? "Payment successful! Your course is now available."
            : "Payment successful! Your order is confirmed.",
        );

        setTimeout(() => {
          if (mounted) {
            navigate(courseId ? `/courses/${courseId}` : "/payments", {
              replace: true,
              state: {
                paymentSuccess: true,
              },
            });
          }
        }, 900);
      } catch (error) {
        if (!mounted) return;

        console.error(
          "Paystack callback verification error:",
          error,
        );

        setStatus("error");
        setMessage(
          getApiMessage(
            error,
            "We could not verify your payment. Please check your Payments page or contact support.",
          ),
        );
      }
    };

    verifyPayment();

    return () => {
      mounted = false;
    };
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg"
      >
        <Card className="overflow-hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-xl sm:p-10">
          {status === "verifying" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Verifying Payment
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {message}
              </p>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                Please don't close this page while we complete
                the verification.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Payment Successful
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {message}
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening your course...
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-9 w-9 text-red-600" />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Payment Verification Issue
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {message}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  type="button"
                  onClick={() => navigate("/payments")}
                  className="w-full sm:w-auto"
                >
                  View Payments
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/courses")}
                  className="w-full sm:w-auto"
                >
                  Back to Courses
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}


