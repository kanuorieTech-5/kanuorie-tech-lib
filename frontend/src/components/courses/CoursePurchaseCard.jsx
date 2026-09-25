import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  LockKeyhole,
  Sparkles,
  UserCheck,
} from "lucide-react";

import { Badge, Button, Card } from "../common";

const formatPrice = (price, currency = "USD") => {
  const value = Number(price);

  if (!Number.isFinite(value) || value <= 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDuration = (duration) => {
  const value = Number(duration);

  if (!Number.isFinite(value) || value <= 0) {
    return "Self-paced";
  }

  if (value === 1) {
    return "1 hour";
  }

  return `${value} hours`;
};

export default function CoursePurchaseCard({
  course,
  enrolled = false,
  loading = false,
  onEnroll,
  onBuy,
}) {
  if (!course || enrolled) {
    return null;
  }

  const isPremium = Boolean(course.premium);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="overflow-hidden border-slate-200 p-0 shadow-xl shadow-slate-200/40">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-yellow-300/10 blur-2xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/20 bg-white/10 text-white">
                {isPremium ? "Premium Course" : "Free Course"}
              </Badge>

              {course.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs font-semibold text-yellow-100">
                  <Sparkles size={13} />
                  Featured
                </span>
              )}
            </div>

            <h3 className="mt-4 text-2xl font-black sm:text-3xl">
              {isPremium ? "Start Learning Today" : "Start Learning for Free"}
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              {isPremium
                ? "Get full access to the course curriculum, lessons, assessments, and your learning progress."
                : "Enroll now to unlock the complete course curriculum and start learning."}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Course access
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4">
                <span className="text-3xl font-black text-slate-900">
                  {isPremium
                    ? formatPrice(course.price, course.currency)
                    : "Free"}
                </span>

                <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock3 size={16} />
                  {formatDuration(course.duration)}
                </span>

                {course.level && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {course.level}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full lg:w-auto">
              <Button
                type="button"
                onClick={isPremium ? onBuy : onEnroll}
                disabled={loading}
                className="w-full px-7 py-3 lg:min-w-52"
              >
                {loading ? (
                  "Please wait..."
                ) : isPremium ? (
                  <>
                    <CreditCard className="mr-2" size={18} />
                    Buy Course
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2" size={18} />
                    Enroll Now
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 shrink-0 text-green-500"
                size={18}
              />
              <span className="text-sm text-slate-600">
                Full curriculum access after enrollment
              </span>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 shrink-0 text-green-500"
                size={18}
              />
              <span className="text-sm text-slate-600">
                Track your learning progress
              </span>
            </div>

            {isPremium && (
              <>
                <div className="flex items-start gap-3">
                  <CreditCard
                    className="mt-0.5 shrink-0 text-blue-500"
                    size={18}
                  />
                  <span className="text-sm text-slate-600">
                    Secure course checkout
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <LockKeyhole
                    className="mt-0.5 shrink-0 text-blue-500"
                    size={18}
                  />
                  <span className="text-sm text-slate-600">
                    Premium lessons remain protected
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
