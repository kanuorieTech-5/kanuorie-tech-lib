import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts";
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
  ShieldCheck,
  FileText,
  Info,
  Loader2,
  Plus,
} from "lucide-react";
import { getCourses } from "../api/courseApi";
import {
  getOrders,
  getPaymentOverview,
  getTransactions,
  getBillingProfile,
  updateBillingProfile,
  initializePaystackCoursePayment,
  initializePaystackOrderPayment,
  initializePaystackCustomPayment,
} from "../api/paymentApi";

const tabs = [
  {
    id: "transactions",
    label: "All Transactions",
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("transactions");
  const [search, setSearch] = useState("");
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [payingOrderId, setPayingOrderId] = useState("");
  const [billingProfile, setBillingProfile] = useState(null);
  const [billingForm, setBillingForm] = useState({
    companyName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [billingEditing, setBillingEditing] = useState(false);
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingMessage, setBillingMessage] = useState("");
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [newPaymentCategory, setNewPaymentCategory] = useState("service");
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentDescription, setNewPaymentDescription] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [newPaymentLoading, setNewPaymentLoading] = useState(false);
  const [newPaymentError, setNewPaymentError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getPaymentOverview(),
      getTransactions(),
      getOrders(),
      getBillingProfile(),
    ])
      .then(
        ([
          overviewResponse,
          transactionResponse,
          orderResponse,
          billingResponse,
        ]) => {
          if (!active) return;
          setOverview(overviewResponse?.data || null);
          setTransactions(
            transactionResponse?.data?.transactions ||
              transactionResponse?.data?.payments ||
              [],
          );
          setOrders(orderResponse?.data?.orders || []);
          const profile = billingResponse?.data?.billingProfile || {};
          setBillingProfile(profile);
          setBillingForm({
            companyName: profile.companyName || "",
            addressLine1: profile.addressLine1 || "",
            addressLine2: profile.addressLine2 || "",
            city: profile.city || "",
            state: profile.state || "",
            postalCode: profile.postalCode || "",
            country: profile.country || "",
          });
        },
      )
      .catch((error) => {
        if (active) {
          setPageError(
            error?.response?.data?.message ||
              "We couldn't load your payment history. Please refresh and try again.",
          );
        }
      })
      .finally(() => {
        if (active) setPageLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isNewPaymentOpen || newPaymentCategory !== "course") return undefined;

    let active = true;
    setCoursesLoading(true);
    getCourses()
      .then((response) => {
        if (!active) return;
        const courses = Array.isArray(response?.data) ? response.data : [];
        setAvailableCourses(
          courses.filter(
            (course) =>
              course.premium &&
              Number(course.price) > 0 &&
              String(course.currency || "NGN").toUpperCase() === "NGN",
          ),
        );
      })
      .catch((error) => {
        if (active) {
          setNewPaymentError(
            error?.response?.data?.message ||
              "Unable to load available courses.",
          );
        }
      })
      .finally(() => {
        if (active) setCoursesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isNewPaymentOpen, newPaymentCategory]);

  const handlePayOrder = async (orderId) => {
    try {
      setPageError("");
      setPayingOrderId(orderId);
      const response = await initializePaystackOrderPayment(orderId);
      const authorizationUrl = response?.data?.paystack?.authorization_url;
      if (!authorizationUrl)
        throw new Error("Paystack did not return a checkout link.");
      window.location.assign(authorizationUrl);
    } catch (error) {
      setPageError(
        error?.response?.data?.message ||
          error?.message ||
          "We couldn't start your Paystack checkout. Please try again.",
      );
      setPayingOrderId("");
    }
  };

  const handleNewPayment = async (event) => {
    event.preventDefault();
    setNewPaymentError("");
    setNewPaymentLoading(true);

    try {
      const response =
        newPaymentCategory === "course"
          ? await initializePaystackCoursePayment(selectedCourseId)
          : await initializePaystackCustomPayment({
              category: newPaymentCategory,
              amount: Number(newPaymentAmount),
              description: newPaymentDescription.trim(),
            });
      const authorizationUrl = response?.data?.paystack?.authorization_url;
      if (!authorizationUrl)
        throw new Error("Paystack did not return a checkout link.");
      window.location.assign(authorizationUrl);
    } catch (error) {
      setNewPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start checkout. Please try again.",
      );
      setNewPaymentLoading(false);
    }
  };

  const saveBillingAddress = async (event) => {
    event.preventDefault();
    setBillingSaving(true);
    setBillingMessage("");
    try {
      const response = await updateBillingProfile({
        ...billingForm,
        fullName: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
      });
      const updated = response?.data?.billingProfile || billingForm;
      setBillingProfile(updated);
      setBillingEditing(false);
      setBillingMessage("Billing information saved.");
    } catch (error) {
      setBillingMessage(
        error?.response?.data?.message || "Unable to save billing information.",
      );
    } finally {
      setBillingSaving(false);
    }
  };

  const displayTransactions = useMemo(
    () =>
      transactions.map((payment) => ({
        ...payment,
        id: payment._id,
        reference: payment.providerReference,
        description:
          payment.order?.items
            ?.map((item) => item.title)
            .filter(Boolean)
            .join(", ") || `Order ${payment.order?.orderNumber || "payment"}`,
        amount: formatCurrency(payment.amount, payment.currency),
        date: payment.createdAt
          ? new Date(payment.createdAt).toLocaleDateString()
          : "—",
        status: payment.status === "successful" ? "successful" : payment.status,
      })),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) {
      return displayTransactions;
    }

    const query = search.toLowerCase();

    return displayTransactions.filter((transaction) => {
      return (
        transaction.reference?.toLowerCase().includes(query) ||
        transaction.description?.toLowerCase().includes(query)
      );
    });
  }, [search, displayTransactions]);

  const openOrdersCount = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const billingAddress = [
    billingProfile?.addressLine1,
    billingProfile?.addressLine2,
    billingProfile?.city,
    billingProfile?.state,
    billingProfile?.postalCode,
    billingProfile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
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

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Manage your payments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                View your purchases, transactions, payment methods, and billing
                information in one secure place.
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
            value={
              pageLoading
                ? "—"
                : formatCurrency(
                    overview?.totalPaid || 0,
                    overview?.currency || "NGN",
                  )
            }
            icon={WalletCards}
          />

          <OverviewCard
            label="Purchases"
            value={pageLoading ? "—" : overview?.totalOrders || 0}
            icon={ShoppingBag}
          />

          <OverviewCard
            label="Transactions"
            value={pageLoading ? "—" : overview?.totalPayments || 0}
            icon={Receipt}
          />

          <OverviewCard
            label="Open Orders"
            value={pageLoading ? "—" : openOrdersCount}
            icon={CreditCard}
          />
        </motion.div>

        {pageError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            {pageError}
          </div>
        )}

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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-emerald-900">
              Secure payments
            </h2>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Payment information and transactions will be securely handled
              through Paystack, the configured payment provider.
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
          className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
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
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
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
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    Transaction History
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    View payments and transaction activity.
                  </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transactions..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Your Purchases
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Access your purchased courses, products, and digital
                  resources.
                </p>
              </div>

              {pageLoading ? (
                <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-slate-500 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading
                  purchases...
                </div>
              ) : orders.length ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => {
                    const isPending = order.status === "pending";
                    const supportsPaystack =
                      String(order.currency).toUpperCase() === "NGN";
                    const itemNames = order.items
                      ?.map((item) => item.title)
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <div
                        key={order._id}
                        className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                      >
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {itemNames || `Order ${order.orderNumber}`}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {order.orderNumber} ·{" "}
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <div className="text-right">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {formatCurrency(order.total, order.currency)}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                              {order.status?.replaceAll("_", " ")}
                            </p>
                          </div>
                          {isPending && supportsPaystack && (
                            <button
                              type="button"
                              onClick={() => handlePayOrder(order._id)}
                              disabled={Boolean(payingOrderId)}
                              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
                            >
                              {payingOrderId === order._id && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              )}
                              {payingOrderId === order._id
                                ? "Opening checkout..."
                                : "Pay Now"}
                            </button>
                          )}
                          {isPending && !supportsPaystack && (
                            <span className="max-w-36 text-right text-xs text-amber-700 dark:text-amber-300">
                              Paystack checkout currently supports NGN only.
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={ShoppingBag}
                  title="No purchases yet"
                  description="When you create an order, it will appear here with a secure Paystack checkout option."
                  actionLabel="Explore Courses"
                  actionHref="/courses"
                />
              )}
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === "methods" && (
            <div>
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    Paystack Checkout
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Pay securely through the configured KanuorieTech Paystack
                    account when you check out an eligible order.
                  </p>
                </div>
              </div>

              <div className="px-5 py-12 sm:px-6">
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Need to make a new payment?
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Pay for a course, a service quote, or another agreed item.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPaymentError("");
                      setIsNewPaymentOpen(true);
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" /> Make a New Payment
                  </button>
                </div>

                <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:bg-slate-950">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                    <ShieldCheck className="h-7 w-7 text-emerald-500" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Your payment details stay with Paystack
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Use “Make a New Payment” for courses, services, or another
                    agreed charge, or choose “Pay Now” for an existing pending
                    NGN order. Paystack handles your card details securely.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Information */}
          {activeTab === "billing" && (
            <div>
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Billing Information
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your billing details can be used for invoices and receipts.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Billing details
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
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
                    value={
                      [user?.firstName, user?.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      billingProfile?.fullName ||
                      "Not provided"
                    }
                  />

                  <BillingField
                    label="Email Address"
                    value={user?.email || "Not provided"}
                  />

                  <BillingField
                    label="Phone Number"
                    value={user?.phone || "Not provided"}
                  />

                  <BillingField
                    label="Billing Address"
                    value={billingAddress || "Not provided"}
                  />

                  {billingProfile?.companyName && (
                    <BillingField
                      label="Company"
                      value={billingProfile.companyName}
                    />
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBillingMessage("");
                      setBillingEditing((editing) => !editing);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {billingEditing
                      ? "Close billing editor"
                      : "Update Billing Address"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <Link
                    to="/profile"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Update name, email, or phone in your profile
                  </Link>
                </div>

                {billingMessage && (
                  <p
                    role="status"
                    className="mt-4 text-sm text-slate-600 dark:text-slate-300"
                  >
                    {billingMessage}
                  </p>
                )}

                {billingEditing && (
                  <form
                    onSubmit={saveBillingAddress}
                    className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Billing address
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {[
                        { name: "companyName", label: "Company (optional)" },
                        { name: "addressLine1", label: "Address line 1" },
                        { name: "addressLine2", label: "Address line 2" },
                        { name: "city", label: "City" },
                        { name: "state", label: "State / Region" },
                        { name: "postalCode", label: "Postal code" },
                        { name: "country", label: "Country" },
                      ].map((field) => (
                        <label
                          key={field.name}
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {field.label}
                          <input
                            name={field.name}
                            value={billingForm[field.name]}
                            onChange={(event) =>
                              setBillingForm((current) => ({
                                ...current,
                                [field.name]: event.target.value,
                              }))
                            }
                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBillingForm({
                            companyName: billingProfile?.companyName || "",
                            addressLine1: billingProfile?.addressLine1 || "",
                            addressLine2: billingProfile?.addressLine2 || "",
                            city: billingProfile?.city || "",
                            state: billingProfile?.state || "",
                            postalCode: billingProfile?.postalCode || "",
                            country: billingProfile?.country || "",
                          });
                          setBillingEditing(false);
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={billingSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {billingSaving && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {billingSaving ? "Saving..." : "Save Billing Address"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </motion.section>
      </div>

      {isNewPaymentOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !newPaymentLoading) {
              setIsNewPaymentOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-payment-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8"
          >
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Secure Paystack checkout
              </p>
              <h2
                id="new-payment-title"
                className="mt-2 text-2xl font-bold text-slate-900 dark:text-white"
              >
                Make a new payment
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose what you are paying for. Course prices are loaded from
                the catalog; service and other payments should match your agreed
                amount.
              </p>
            </div>

            {newPaymentError && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
              >
                {newPaymentError}
              </p>
            )}

            <form onSubmit={handleNewPayment} className="space-y-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Payment category
                <select
                  value={newPaymentCategory}
                  onChange={(event) => {
                    setNewPaymentCategory(event.target.value);
                    setNewPaymentError("");
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="service">Service</option>
                  <option value="course">Course</option>
                  <option value="other">Other payment</option>
                </select>
              </label>

              {newPaymentCategory === "course" ? (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Paid course
                  <select
                    required
                    value={selectedCourseId}
                    onChange={(event) =>
                      setSelectedCourseId(event.target.value)
                    }
                    disabled={coursesLoading}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="">
                      {coursesLoading
                        ? "Loading paid courses..."
                        : "Choose a course"}
                    </option>
                    {availableCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title} —{" "}
                        {formatCurrency(course.price, course.currency)}
                      </option>
                    ))}
                  </select>
                  {!coursesLoading && availableCourses.length === 0 && (
                    <span className="mt-2 block font-normal text-slate-500 dark:text-slate-400">
                      No paid NGN courses are currently available.
                    </span>
                  )}
                </label>
              ) : (
                <>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {newPaymentCategory === "service"
                      ? "Service or quote description"
                      : "What is this payment for?"}
                    <input
                      required
                      maxLength={160}
                      value={newPaymentDescription}
                      onChange={(event) =>
                        setNewPaymentDescription(event.target.value)
                      }
                      placeholder={
                        newPaymentCategory === "service"
                          ? "e.g. Website design project"
                          : "e.g. Invoice or product name"
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Amount (NGN)
                    <input
                      required
                      type="number"
                      min="1"
                      max="100000000"
                      step="0.01"
                      value={newPaymentAmount}
                      onChange={(event) =>
                        setNewPaymentAmount(event.target.value)
                      }
                      placeholder="Enter agreed amount"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </label>
                </>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsNewPaymentOpen(false)}
                  disabled={newPaymentLoading}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    newPaymentLoading ||
                    (newPaymentCategory === "course" &&
                      (coursesLoading || availableCourses.length === 0))
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {newPaymentLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {newPaymentLoading
                    ? "Preparing checkout..."
                    : "Continue to Paystack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const formatCurrency = (amount = 0, currency = "NGN") => {
  const normalizedCurrency = String(currency || "NGN").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  } catch {
    return `${normalizedCurrency} ${(Number(amount) || 0).toLocaleString()}`;
  }
};

/* =========================================
   OVERVIEW CARD
========================================= */

function OverviewCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
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

  const config = statusConfig[transaction.status] || statusConfig.pending;

  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Receipt className="h-5 w-5 text-blue-600" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
          {transaction.description}
        </h3>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {transaction.reference}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {transaction.amount}
          </p>

          <p className="mt-1 text-xs text-slate-400">{transaction.date}</p>
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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
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
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}
