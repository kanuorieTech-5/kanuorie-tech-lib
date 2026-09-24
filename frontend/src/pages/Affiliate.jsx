import { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Link2,
  Copy,
  Check,
  MousePointerClick,
  Users,
  Wallet,
  Clock3,
  ArrowUpRight,
  CreditCard,
  Info,
} from "lucide-react";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const stats = [
  {
    label: "Total Clicks",
    value: "0",
    icon: MousePointerClick,
  },
  {
    label: "Referrals",
    value: "0",
    icon: Users,
  },
  {
    label: "Total Earnings",
    value: "$0.00",
    icon: Wallet,
  },
  {
    label: "Pending Earnings",
    value: "$0.00",
    icon: Clock3,
  },
];

export default function Affiliate() {
  const [copied, setCopied] = useState(false);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=YOUR_CODE`
      : "";

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================================
            HEADER
        ========================================= */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <Handshake className="h-4 w-4" />
                KanuorieTech Affiliate Program
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Grow with KanuorieTech
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Share KanuorieTech with your network and track your referrals,
                commissions, and payouts from one place.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              Affiliate account pending setup
            </div>
          </div>
        </motion.div>

        {/* =========================================
            REFERRAL LINK
        ========================================= */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-600 to-slate-900 shadow-sm"
        >
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Link2 className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      Your Referral Link
                    </h2>

                    <p className="mt-1 text-xs text-blue-100">
                      Share your unique link to start earning referrals.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                    <span className="block truncate">
                      {referralLink}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/10">
                <Handshake className="h-12 w-12 text-white/90" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================================
            STATISTICS
        ========================================= */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.section>

        {/* =========================================
            MAIN GRID
        ========================================= */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =========================================
              REFERRAL HISTORY
          ========================================= */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Referral History
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Track users who join through your referral link.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Users className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No referrals yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your referral activity will appear here once people start
                joining KanuorieTech through your affiliate link.
              </p>
            </div>
          </motion.section>

          {/* =========================================
              AFFILIATE INFORMATION
          ========================================= */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Payout Information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage how you receive commissions.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                  <p className="text-xs leading-5 text-slate-500">
                    Payout details will become available once the affiliate
                    program is activated for your account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
              >
                Add Payout Method
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-semibold text-slate-900">
                How Affiliate Works
              </h2>

              <div className="mt-5 space-y-5">
                {[
                  {
                    number: "01",
                    title: "Share your link",
                    description:
                      "Share your unique KanuorieTech referral link.",
                  },
                  {
                    number: "02",
                    title: "Invite learners",
                    description:
                      "People use your link to discover and join KanuorieTech.",
                  },
                  {
                    number: "03",
                    title: "Earn commissions",
                    description:
                      "Eligible purchases and referrals are tracked in your dashboard.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}