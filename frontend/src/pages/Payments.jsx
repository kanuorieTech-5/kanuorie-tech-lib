import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  WalletCards,
  CreditCard,
  Receipt,
  ShoppingBag,
  BookOpen,
  Search,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  ShieldCheck,
  FileText,
  Info,
} from "lucide-react";

const tabs = [
  {
    id: "transactions",
    label: "Transactions",
    icon: Receipt,
  },
  {
    id: "purchases",
    label: "Purchases",
    icon: ShoppingBag,
  },
  {
    id: "methods",
    label: "Payment Methods",
    icon: CreditCard,
  },
  {
    id: "billing",
    label: "Billing Information",
    icon: FileText,
  },
];

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

export default function Payments() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [search, setSearch] = useState("");

  // Real transaction data will be connected to the backend.
  const transactions = [];

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) {
      return transactions;
    }

    const query = search.toLowerCase();

    return transactions.filter((transaction) => {
      return (
        transaction.reference
          ?.toLowerCase()
          .includes(query) ||
        transaction.description
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [search, transactions]);

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <WalletCards className="h-4 w-4" />
                Accounts & Payments
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Manage your payments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                View your purchases, transactions, payment methods, and
                billing information in one secure place.
              </p>
            </div>
          </div>
        </motion.div>

        {/* =========================================
            OVERVIEW CARDS
        ========================================= */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <OverviewCard
            label="Total Spent"
            value="$0.00"
            icon={WalletCards}
          />

          <OverviewCard
            label="Purchases"
            value="0"
            icon={ShoppingBag}
          />

          <OverviewCard
            label="Transactions"
            value="0"
            icon={Receipt}
          />

          <OverviewCard
            label="Payment Methods"
            value="0"
            icon={CreditCard}
          />
        </motion.div>

        {/* =========================================
            SECURITY NOTICE
        ========================================= */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-emerald-900">
              Secure payments
            </h2>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Payment information and transactions will be securely handled
              through the configured payment provider.
            </p>
          </div>
        </motion.div>

        {/* =========================================
            TABS + CONTENT
        ========================================= */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Tabs */}
          <div className="overflow-x-auto border-b border-slate-100">
            <div className="flex min-w-max px-4 sm:px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative inline-flex items-center gap-2 px-4 py-4 text-sm font-medium transition ${
                      active
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}

                    {active && (
                      <motion.div
                        layoutId="payment-tab"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transactions */}
          {activeTab === "transactions" && (
            <div>
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Transaction History
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    View payments and transaction activity.
                  </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search transactions..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {filteredTransactions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Receipt}
                  title="No transactions yet"
                  description="Your payment transactions will appear here after you make a purchase."
                />
              )}
            </div>
          )}

          {/* Purchases */}
          {activeTab === "purchases" && (
            <div>
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="font-semibold text-slate-900">
                  Your Purchases
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Access your purchased courses, products, and digital
                  resources.
                </p>
              </div>

              <EmptyState
                icon={ShoppingBag}
                title="No purchases yet"
                description="When you purchase a course or digital product, it will appear here."
                actionLabel="Explore Courses"
                actionHref="/courses"
              />
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === "methods" && (
            <div>
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Payment Methods
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage the payment methods available for your account.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Payment Method
                </button>
              </div>

              <div className="px-5 py-12 sm:px-6">
                <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <CreditCard className="h-7 w-7 text-slate-400" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    No payment methods added
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add a payment method when payment processing is enabled
                    for your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Information */}
          {activeTab === "billing" && (
            <div>
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="font-semibold text-slate-900">
                  Billing Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your billing details can be used for invoices and receipts.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Billing details
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Your billing information will be connected to your
                        account profile and used when generating invoices or
                        receipts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <BillingField
                    label="Full Name"
                    value="Not provided"
                  />

                  <BillingField
                    label="Email Address"
                    value="Not provided"
                  />

                  <BillingField
                    label="Phone Number"
                    value="Not provided"
                  />

                  <BillingField
                    label="Billing Address"
                    value="Not provided"
                  />
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Update Billing Information
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

/* =========================================
   OVERVIEW CARD
========================================= */

function OverviewCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

/* =========================================
   TRANSACTION ROW
========================================= */

function TransactionRow({ transaction }) {
  const statusConfig = {
    successful: {
      label: "Successful",
      icon: CheckCircle2,
      className: "text-emerald-600 bg-emerald-50",
    },
    pending: {
      label: "Pending",
      icon: Clock3,
      className: "text-amber-600 bg-amber-50",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      className: "text-red-600 bg-red-50",
    },
  };

  const config =
    statusConfig[transaction.status] ||
    statusConfig.pending;

  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Receipt className="h-5 w-5 text-blue-600" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">
          {transaction.description}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {transaction.reference}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-slate-900">
            {transaction.amount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {transaction.date}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {config.label}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Download receipt"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* =========================================
   EMPTY STATE
========================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <BookOpen className="h-4 w-4" />
          {actionLabel}
        </a>
      )}
    </div>
  );
}

/* =========================================
   BILLING FIELD
========================================= */

function BillingField({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}