import { useCallback, useEffect, useState } from "react";
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
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  Banknote,
  X,
} from "lucide-react";

import {
  getAffiliateDashboard,
  activateAffiliate,
  getAffiliateReferrals,
  getAffiliateEarnings,
  getAffiliatePayouts,
  updateAffiliatePayout,
  requestAffiliatePayout,
} from "../services/affiliate.service";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const initialPayoutForm = {
  payoutMethod: "bank_transfer",
  accountName: "",
  accountNumber: "",
  bankName: "",
  bankCode: "",
  paypalEmail: "",
};

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-red-50 text-red-700",
  inactive: "bg-slate-100 text-slate-600",
  clicked: "bg-blue-50 text-blue-700",
  registered: "bg-indigo-50 text-indigo-700",
  qualified: "bg-violet-50 text-violet-700",
  converted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  approved: "bg-emerald-50 text-emerald-700",
  paid: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
};

function StatusBadge({ status }) {
  const normalized = String(status || "unknown").toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        statusStyles[normalized] || "bg-slate-100 text-slate-600"
      }`}
    >
      {normalized.replace(/_/g, " ")}
    </span>
  );
}

export default function Affiliate() {
  const [dashboard, setDashboard] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activating, setActivating] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [showPayoutHistory, setShowPayoutHistory] = useState(false);

  const [payoutForm, setPayoutForm] = useState(initialPayoutForm);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [dashboardResponse, referralResponse, earningsResponse, payoutsResponse] =
        await Promise.all([
          getAffiliateDashboard(),
          getAffiliateReferrals({ page: 1, limit: 10 }),
          getAffiliateEarnings(),
          getAffiliatePayouts(),
        ]);

      setDashboard(dashboardResponse?.data || null);
      setReferrals(referralResponse?.data?.items || []);
      setEarnings(earningsResponse?.data?.items || []);
      setPayouts(payoutsResponse?.data?.items || []);

      const affiliate = dashboardResponse?.data?.affiliate;

      if (affiliate) {
        setPayoutForm({
          payoutMethod: affiliate.payoutMethod || "bank_transfer",
          accountName: affiliate.payoutDetails?.accountName || "",
          accountNumber: affiliate.payoutDetails?.accountNumber || "",
          bankName: affiliate.payoutDetails?.bankName || "",
          bankCode: affiliate.payoutDetails?.bankCode || "",
          paypalEmail: affiliate.payoutDetails?.paypalEmail || "",
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const affiliate = dashboard?.affiliate;
  const overview = dashboard?.overview || {};
  const referralLink = affiliate?.referralLink || "";
  const currency = overview.currency || "USD";

  const stats = [
    {
      label: "Total Clicks",
      value: Number(overview.totalClicks || 0).toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Successful Referrals",
      value: Number(overview.successfulReferrals || 0).toLocaleString(),
      icon: Users,
    },
    {
      label: "Total Earnings",
      value: formatMoney(overview.totalEarnings, currency),
      icon: Wallet,
    },
    {
      label: "Pending Earnings",
      value: formatMoney(overview.pendingEarnings, currency),
      icon: Clock3,
    },
  ];

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setNotice("Referral link copied successfully.");

      window.setTimeout(() => setCopied(false), 2000);
      window.setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Unable to copy the link. Please copy it manually.");
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    setError("");
    setNotice("");

    try {
      const response = await activateAffiliate();

      if (response?.success === false) {
        throw new Error(response.message || "Activation failed.");
      }

      setNotice(response?.message || "Affiliate account activated.");
      await loadDashboard(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActivating(false);
    }
  };

  const handlePayoutField = (event) => {
    const { name, value } = event.target;

    setPayoutForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSavePayout = async (event) => {
    event.preventDefault();
    setSavingPayout(true);
    setError("");
    setNotice("");

    const {
      payoutMethod,
      accountName,
      accountNumber,
      bankName,
      bankCode,
      paypalEmail,
    } = payoutForm;

    const payoutDetails = {
      accountName,
      accountNumber,
      bankName,
      bankCode,
      paypalEmail,
    };

    if (payoutMethod === "bank_transfer") {
      if (!accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
        setError("Enter your account name, account number, and bank name.");
        setSavingPayout(false);
        return;
      }
    }

    if (payoutMethod === "paypal" && !paypalEmail.trim()) {
      setError("Enter the email address associated with your PayPal account.");
      setSavingPayout(false);
      return;
    }

    try {
      const response = await updateAffiliatePayout(
        payoutMethod,
        payoutDetails
      );

      if (response?.success === false) {
        throw new Error(response.message || "Could not save payout details.");
      }

      setNotice(response?.message || "Payout information saved.");
      setShowPayoutForm(false);
      await loadDashboard(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingPayout(false);
    }
  };

  const handleRequestPayout = async () => {
    if (
      !window.confirm(
        "Request a payout of your currently approved affiliate earnings?"
      )
    ) {
      return;
    }

    setRequestingPayout(true);
    setError("");
    setNotice("");

    try {
      const response = await requestAffiliatePayout();

      if (response?.success === false) {
        throw new Error(response.message || "Payout request failed.");
      }

      setNotice(response?.message || "Payout request submitted.");
      await loadDashboard(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRequestingPayout(false);
    }
  };

  const hasPayoutDetails = Boolean(affiliate?.payoutMethod);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-600">
            Loading your affiliate dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard && error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load affiliate dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => loadDashboard()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
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

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={affiliate?.status} />

              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                aria-label="Refresh affiliate dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* NOTICES */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="ml-auto"
              aria-label="Dismiss notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* PENDING ACCOUNT */}
        {affiliate?.status === "pending" && (
          <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <h2 className="font-semibold text-amber-900">
              Activate your affiliate account
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Your affiliate account is pending. Activate it to enable referral
              tracking and start sharing your referral link.
            </p>
            <button
              type="button"
              onClick={handleActivate}
              disabled={activating}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activating && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              {activating ? "Activating..." : "Activate Affiliate Account"}
            </button>
          </section>
        )}

        {affiliate?.status === "suspended" && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="font-semibold text-red-900">
              Affiliate account suspended
            </h2>
            <p className="mt-2 text-sm text-red-800">
              Referral tracking is unavailable while your account is suspended.
              Please contact KanuorieTech support for assistance.
            </p>
          </section>
        )}

        {/* REFERRAL LINK */}
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
                      {affiliate?.status === "active"
                        ? "Share your unique link to invite new users."
                        : "Your link is available, but tracking requires an active account."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                    <span className="block break-all">
                      {referralLink || "Your referral link is not available."}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!referralLink}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
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

                {affiliate?.referralCode && (
                  <p className="mt-3 text-xs text-blue-100">
                    Referral code:{" "}
                    <span className="font-bold tracking-wider">
                      {affiliate.referralCode}
                    </span>
                    {" · "}
                    Commission rate:{" "}
                    <span className="font-bold">
                      {Number(affiliate.commissionRate || 0)}%
                    </span>
                  </p>
                )}
              </div>

              <div className="hidden h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/10 lg:flex">
                <Handshake className="h-12 w-12 text-white/90" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATISTICS */}
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
                    <p className="mt-2 break-words text-xl font-bold text-slate-900 sm:text-2xl">
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

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* REFERRAL HISTORY */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Referral History
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Recent referral activity from your account.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {referrals.length}
              </span>
            </div>

            {referrals.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Users className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No referrals yet
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  When someone registers using your referral link, their
                  referral activity will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Referral</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referrals.map((item) => {
                      const user = item.referredUser;
                      const displayName = user
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "Referral visitor";

                      return (
                        <tr key={item._id} className="hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">
                              {displayName || "Registered user"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.referralCode || "—"}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                            {formatMoney(
                              item.commissionAmount,
                              item.commissionCurrency || currency
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {referrals.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                Showing the latest {referrals.length} referrals.
              </div>
            )}
          </motion.section>

          {/* SIDEBAR */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* EARNINGS SUMMARY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Earnings Summary
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Commission breakdown
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  {
                    label: "Pending",
                    value: overview.pendingEarnings,
                  },
                  {
                    label: "Approved",
                    value: overview.approvedEarnings,
                  },
                  {
                    label: "Paid",
                    value: overview.paidEarnings,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-slate-600">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatMoney(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowPayoutHistory((current) => !current)}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {showPayoutHistory ? "Hide payout history" : "View payout history"}
                <ArrowUpRight className="h-4 w-4" />
              </button>

              {showPayoutHistory && (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  {payouts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No payout requests yet.
                    </p>
                  ) : (
                    payouts.map((payout) => (
                      <div
                        key={payout._id}
                        className="rounded-xl bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">
                            {formatMoney(payout.amount, payout.currency || currency)}
                          </span>
                          <StatusBadge status={payout.status} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(payout.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>

            {/* PAYOUT INFORMATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Payout Information
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Manage where commissions are sent.
                  </p>
                </div>
              </div>

              {hasPayoutDetails ? (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Payout method
                  </p>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                    {affiliate.payoutMethod.replace(/_/g, " ")}
                  </p>

                  {affiliate.payoutDetails?.bankName && (
                    <p className="mt-2 text-sm text-slate-600">
                      Bank: {affiliate.payoutDetails.bankName}
                    </p>
                  )}
                  {affiliate.payoutDetails?.accountName && (
                    <p className="mt-1 text-sm text-slate-600">
                      Account: {affiliate.payoutDetails.accountName}
                    </p>
                  )}
                  {affiliate.payoutDetails?.accountNumber && (
                    <p className="mt-1 text-sm text-slate-600">
                      Account number: {affiliate.payoutDetails.accountNumber}
                    </p>
                  )}
                  {affiliate.payoutDetails?.paypalEmail && (
                    <p className="mt-1 break-all text-sm text-slate-600">
                      PayPal: {affiliate.payoutDetails.paypalEmail}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <p className="text-xs leading-5 text-slate-500">
                      Add a payout method so your approved commissions can be
                      paid when eligible.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowPayoutForm((current) => !current)}
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {showPayoutForm
                  ? "Cancel"
                  : hasPayoutDetails
                    ? "Update Payout Method"
                    : "Add Payout Method"}
              </button>

              {showPayoutForm && (
                <form onSubmit={handleSavePayout} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="payoutMethod"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Payout method
                    </label>
                    <select
                      id="payoutMethod"
                      name="payoutMethod"
                      value={payoutForm.payoutMethod}
                      onChange={handlePayoutField}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="bank_transfer">Bank transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {payoutForm.payoutMethod === "bank_transfer" && (
                    <>
                      <div>
                        <label
                          htmlFor="accountName"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Account name
                        </label>
                        <input
                          id="accountName"
                          name="accountName"
                          value={payoutForm.accountName}
                          onChange={handlePayoutField}
                          required
                          autoComplete="name"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                          placeholder="Account holder name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="accountNumber"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Account number
                        </label>
                        <input
                          id="accountNumber"
                          name="accountNumber"
                          value={payoutForm.accountNumber}
                          onChange={handlePayoutField}
                          required
                          inputMode="numeric"
                          autoComplete="off"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                          placeholder="Bank account number"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="bankName"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Bank name
                        </label>
                        <input
                          id="bankName"
                          name="bankName"
                          value={payoutForm.bankName}
                          onChange={handlePayoutField}
                          required
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                          placeholder="Name of your bank"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="bankCode"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Bank code (optional)
                        </label>
                        <input
                          id="bankCode"
                          name="bankCode"
                          value={payoutForm.bankCode}
                          onChange={handlePayoutField}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                          placeholder="Bank code"
                        />
                      </div>
                    </>
                  )}

                  {payoutForm.payoutMethod === "paypal" && (
                    <div>
                      <label
                        htmlFor="paypalEmail"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        PayPal email
                      </label>
                      <input
                        id="paypalEmail"
                        name="paypalEmail"
                        type="email"
                        value={payoutForm.paypalEmail}
                        onChange={handlePayoutField}
                        required
                        autoComplete="email"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  )}

                  {payoutForm.payoutMethod === "other" && (
                    <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                      Your preferred payout method will be saved. Confirm
                      availability with KanuorieTech before requesting payment.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={savingPayout}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {savingPayout && (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                    {savingPayout ? "Saving..." : "Save Payout Information"}
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={handleRequestPayout}
                disabled={
                  requestingPayout ||
                  affiliate?.status !== "active" ||
                  !hasPayoutDetails ||
                  Number(overview.approvedEarnings || 0) <= 0
                }
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                {requestingPayout ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                {requestingPayout ? "Submitting..." : "Request Payout"}
              </button>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Payout requests require an active account, saved payout
                information, and approved earnings.
              </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
                  <div key={step.number} className="flex gap-3">
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
            </section>
          </motion.aside>
        </div>

        {/* EARNINGS LEDGER */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">
              Commission History
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Commission records returned by your affiliate account.
            </p>
          </div>

          {earnings.length === 0 ? (
            <div className="px-5 py-8 text-sm text-slate-500 sm:px-6">
              No commission records yet. Commissions will appear here when
              eligible activity generates earnings.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Referral Code</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {earnings.map((item) => (
                    <tr key={item._id}>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {item.referralCode || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.commissionStatus} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                        {formatMoney(
                          item.commissionAmount,
                          item.commissionCurrency || currency
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}