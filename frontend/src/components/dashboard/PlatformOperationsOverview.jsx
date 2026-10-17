import { useEffect, useState } from "react";
import {
  Users,
  Handshake,
  GraduationCap,
  Award,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Wallet,
  UserCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import * as operationsApi from "../../api/operationsApi";
/* ========================================
   VALUE FORMATTERS
======================================== */

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return numericValue.toLocaleString();
  }

  return String(value);
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value).filter(
      ([, amount]) => amount !== null && amount !== undefined
    );

    if (!entries.length) {
      return "0";
    }

    return entries
      .map(
        ([currency, amount]) =>
          `${currency} ${Number(amount).toLocaleString()}`
      )
      .join(" • ");
  }

  return String(value);
}

function formatConfiguredValue(value, configured) {
  if (configured === false) {
    return "Not configured";
  }

  return formatNumber(value);
}

/* ========================================
   METRIC
======================================== */

function Metric({
  label,
  value,
  icon: Icon,
  description,
  status,
  formatter = formatNumber,
}) {
  return (
    <div
      data-metric-card
      data-metric-label={label}
      data-metric-value={formatter(value)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${label}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-slate-900">
            {formatter(value)}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon size={19} />
          </div>
        )}
      </div>

      {status && (
        <div className="mt-3">
          {status}
        </div>
      )}
    </div>
  );
}

/* ========================================
   SECTION
======================================== */

function Section({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section
      data-operations-section
      data-section-title={title}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

/* ========================================
   STATUS BADGE
======================================== */

function StatusBadge({ type = "neutral", children }) {
  const styles = {
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200",
    danger:
      "bg-red-50 text-red-700 border-red-200",
    neutral:
      "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[type]}`}
    >
      {children}
    </span>
  );
}

/* ========================================
   PLATFORM OPERATIONS
======================================== */

export default function PlatformOperationsOverview({
  operations = {},
}) {
  const {
    team = {},
    affiliates = {},
    investorsPartners = {},
    enrollments = {},
    certificates = {},
    payments = {},
    compliance = {},
    issues = {},
    feedback = {},
  } = operations;

  const [selectedMetric, setSelectedMetric] = useState(null);

  const [operationRecords, setOperationRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const getRecordsCategory = (section, label) => {
    if (section === "Affiliates & Payouts") {
      return ["Pending Payouts", "Paid Payouts", "Total Commission",
        "Pending Commission"].includes(label)
        ? "payouts"
        : "affiliates";
    }

    if (section === "Investors & Partners") return "inquiries";
    if (section === "Course Enrollment Overview") return "enrollments";
    if (section === "Certificates Issued") return "certificates";
    if (section === "Payment Activities") return "payments";
    if (section === "Issues & Support") return "issues";
    if (section === "Feedback & Reviews") return "feedback";
    if (section === "Compliance Overview") return "compliance";

    return "none";
  };

  const loadOperationRecords = async (category) => {
    if (!category || ["none", "compliance"].includes(category)) {
      setOperationRecords([]);
      return;
    }

    setRecordsLoading(true);
    setRecordsError("");

    try {
      const loaders = {
        affiliates: operationsApi.getOperationsAffiliates,
        payouts: operationsApi.getOperationsPayouts,
        inquiries: operationsApi.getOperationsInquiries,
        enrollments: operationsApi.getOperationsEnrollments,
        certificates: operationsApi.getOperationsCertificates,
        payments: operationsApi.getOperationsPayments,
        issues: operationsApi.getOperationsIssues,
        feedback: operationsApi.getOperationsFeedback,
      };

      const records = await loaders[category]();
      setOperationRecords(records);
    } catch (error) {
      setOperationRecords([]);
      setRecordsError(
        error.response?.data?.message ||
          "Unable to load records. Check your admin access and API connection."
      );
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMetric?.category) {
      loadOperationRecords(selectedMetric.category);
    } else {
      setOperationRecords([]);
      setRecordsError("");
    }
  }, [selectedMetric?.category]);

  useEffect(() => {
    if (!selectedMetric) return;

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setSelectedMetric(null);
    }
  };

  document.addEventListener("keydown", handleEscape);
  document.body.style.overflow = "hidden";

  return () => {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "";
  };
}, [selectedMetric]);

const handleMetricClick = (event) => {
  const card = event.target.closest("[data-metric-card]");
  if (!card) return;

  const section = card.closest("[data-operations-section]");
  if (!section) return;

  const relatedMetrics = Array.from(
    section.querySelectorAll("[data-metric-card]")
  ).map((metric) => ({
    label: metric.dataset.metricLabel,
    value: metric.dataset.metricValue,
  }));

  const label = card.dataset.metricLabel;
  const sectionTitle = section.dataset.sectionTitle;

  const category = getRecordsCategory(sectionTitle, label);

  setOperationRecords([]);
  setRecordsError("");

  setSelectedMetric({
    label,
    value: card.dataset.metricValue,
    section: sectionTitle,
    category,
    relatedMetrics,
  });
};

const handleRecordAction = async (record, status) => {
  const category = selectedMetric?.category;
  const id = record._id;

  if (!id || !category) return;

  let action;

  if (category === "affiliates") {
    action = () =>
      operationsApi.updateOperationsAffiliateStatus(id, status);
  } else if (category === "inquiries") {
    action = () =>
      operationsApi.updateOperationsInquiryStatus(id, status);
  } else if (category === "issues") {
    action = () =>
      operationsApi.updateOperationsIssueStatus(id, status);
  } else if (category === "payouts") {
    let reference;
    let rejectionReason;

    if (status === "paid") {
      reference = window.prompt(
        "Enter the actual payout payment reference:"
      );

      if (!reference?.trim()) return;
    }

    if (status === "rejected") {
      rejectionReason = window.prompt(
        "Enter the reason for rejecting this payout:"
      );

      if (!rejectionReason?.trim()) return;
    }

    action = () =>
      operationsApi.updateOperationsPayoutStatus(id, {
        status,
        reference,
        rejectionReason,
      });
  } else {
    return;
  }

  setActionLoading(id);
  setRecordsError("");

  try {
    await action();
    await loadOperationRecords(category);
  } catch (error) {
    setRecordsError(
      error.response?.data?.message ||
        "The action failed. Please try again."
    );
  } finally {
    setActionLoading("");
  }
};

  const complianceConfigured = compliance.configured !== false;

  return (
    <div className="space-y-8" onClick={handleMetricClick}>
      <Section
        title="Team Overview"
        description="Monitor team members, roles and account status."
        icon={Users}
      >
        <Metric
          label="Team Members"
          value={team.total}
          icon={Users}
        />

        <Metric
          label="Active Members"
          value={team.active}
          icon={UserCheck}
          status={
            team.active !== undefined && (
              <StatusBadge type="success">
                Active
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Inactive Members"
          value={team.inactive}
          icon={XCircle}
        />
      </Section>

      <Section
        title="Affiliates & Payouts"
        description="Track affiliate activity, commissions and payout status."
        icon={Wallet}
      >
        <Metric
          label="Affiliates"
          value={affiliates.total}
          icon={Users}
        />

        <Metric
          label="Active Affiliates"
          value={affiliates.active}
          icon={UserCheck}
        />

        <Metric
          label="Pending Payouts"
          value={affiliates.pendingPayouts}
          icon={Clock3}
          status={
            affiliates.pendingPayouts !== undefined && (
              <StatusBadge type="warning">
                Awaiting payout
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Paid Payouts"
          value={affiliates.paidPayouts}
          icon={CheckCircle2}
        />

        <Metric
          label="Total Commission"
          value={affiliates.totalCommission}
          icon={Wallet}
          formatter={formatCurrency}
        />

        <Metric
          label="Pending Commission"
          value={affiliates.pendingCommission}
          icon={Clock3}
          formatter={formatCurrency}
        />
      </Section>

      {/* ========================================
          INVESTORS & PARTNERS
      ======================================== */}

      <Section
        title="Investors & Partners"
        description="Overview of strategic partnerships and investor inquiries."
        icon={Handshake}
      >
        <Metric
          label="Investor Inquiries"
          value={investorsPartners.investors}
          icon={Users}
        />

        <Metric
          label="Partner Inquiries"
          value={investorsPartners.partners}
          icon={Handshake}
        />

        <Metric
          label="Replied"
          value={investorsPartners.active}
          icon={CheckCircle2}
          status={
            investorsPartners.active !== undefined && (
              <StatusBadge type="success">
                Replied
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Pending Requests"
          value={investorsPartners.pending}
          icon={Clock3}
          status={
            investorsPartners.pending !== undefined && (
              <StatusBadge type="warning">
                Awaiting response
              </StatusBadge>
            )
          }
        />
      </Section>

      {/* ========================================
          COURSE ENROLLMENTS
      ======================================== */}

      <Section
        title="Course Enrollment Overview"
        description="Monitor learner enrollment and course completion activity."
        icon={GraduationCap}
      >
        <Metric
          label="Total Enrollments"
          value={enrollments.total}
          icon={GraduationCap}
        />

        <Metric
          label="Active Enrollments"
          value={enrollments.active}
          icon={UserCheck}
        />

        <Metric
          label="Completed Courses"
          value={enrollments.completed}
          icon={CheckCircle2}
          status={
            enrollments.completed !== undefined && (
              <StatusBadge type="success">
                Completed
              </StatusBadge>
            )
          }
        />

        <Metric
          label="In Progress"
          value={enrollments.inProgress}
          icon={Clock3}
        />
      </Section>

      {/* ========================================
          CERTIFICATES
      ======================================== */}

      <Section
        title="Certificates Issued"
        description="Track certificates generated from completed learning."
        icon={Award}
      >
        <Metric
          label="Certificates Issued"
          value={certificates.total}
          icon={Award}
        />

        <Metric
          label="Issued This Month"
          value={certificates.thisMonth}
          icon={Award}
        />

        <Metric
          label="Pending Certificates"
          value={certificates.pending}
          icon={Clock3}
        />
      </Section>

      {/* ========================================
          PAYMENT ACTIVITIES
      ======================================== */}

      <Section
        title="Payment Activities"
        description="Monitor payment transactions and payment status."
        icon={CreditCard}
      >
        <Metric
          label="Total Payments"
          value={payments.total}
          icon={CreditCard}
        />

        <Metric
          label="Successful"
          value={payments.successful}
          icon={CheckCircle2}
          status={
            payments.successful !== undefined && (
              <StatusBadge type="success">
                Successful
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Pending"
          value={payments.pending}
          icon={Clock3}
          status={
            payments.pending !== undefined && (
              <StatusBadge type="warning">
                Pending
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Failed"
          value={payments.failed}
          icon={XCircle}
          status={
            payments.failed !== undefined && (
              <StatusBadge type="danger">
                Failed
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Refunded"
          value={payments.refunded}
          icon={Wallet}
        />

        <Metric
          label="Payment Volume"
          value={payments.volume}
          icon={Wallet}
          formatter={formatCurrency}
        />
      </Section>

      {/* ========================================
          COMPLIANCE
      ======================================== */}

      <Section
        title="Compliance Overview"
        description={
          complianceConfigured
            ? "Monitor compliance checks, requirements and outstanding items."
            : "A dedicated compliance data source has not been configured yet."
        }
        icon={ShieldCheck}
      >
        <Metric
          label="Compliance Items"
          value={compliance.total}
          icon={ShieldCheck}
          formatter={(value) =>
            formatConfiguredValue(value, complianceConfigured)
          }
          status={
            !complianceConfigured && (
              <StatusBadge type="neutral">
                Not configured
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Compliant"
          value={compliance.compliant}
          icon={CheckCircle2}
          formatter={(value) =>
            formatConfiguredValue(value, complianceConfigured)
          }
          status={
            complianceConfigured &&
            compliance.compliant !== undefined && (
              <StatusBadge type="success">
                Compliant
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Pending Review"
          value={compliance.pending}
          icon={Clock3}
          formatter={(value) =>
            formatConfiguredValue(value, complianceConfigured)
          }
          status={
            complianceConfigured &&
            compliance.pending !== undefined && (
              <StatusBadge type="warning">
                Review required
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Issues"
          value={compliance.issues}
          icon={AlertTriangle}
          formatter={(value) =>
            formatConfiguredValue(value, complianceConfigured)
          }
          status={
            complianceConfigured &&
            compliance.issues !== undefined && (
              <StatusBadge type="danger">
                Attention required
              </StatusBadge>
            )
          }
        />
      </Section>

      {/* ========================================
          ISSUES
      ======================================== */}

      <Section
        title="Issues & Support"
        description="Monitor reported platform issues and support cases."
        icon={AlertTriangle}
      >
        <Metric
          label="Total Issues"
          value={issues.total}
          icon={AlertTriangle}
        />

        <Metric
          label="Open Issues"
          value={issues.open}
          icon={AlertTriangle}
          status={
            issues.open !== undefined && (
              <StatusBadge type="warning">
                Open
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Resolved"
          value={issues.resolved}
          icon={CheckCircle2}
          status={
            issues.resolved !== undefined && (
              <StatusBadge type="success">
                Resolved
              </StatusBadge>
            )
          }
        />
      </Section>

      {/* ========================================
          FEEDBACK
      ======================================== */}

      <Section
        title="Feedback & Reviews"
        description="Monitor learner, customer and platform feedback."
        icon={MessageSquare}
      >
        <Metric
          label="Total Feedback"
          value={feedback.total}
          icon={MessageSquare}
        />

        <Metric
          label="New Feedback"
          value={feedback.new}
          icon={MessageSquare}
        />

        <Metric
          label="Positive Feedback"
          value={feedback.positive}
          icon={CheckCircle2}
          status={
            feedback.positive !== undefined && (
              <StatusBadge type="success">
                Positive
              </StatusBadge>
            )
          }
        />

        <Metric
          label="Needs Response"
          value={feedback.needsResponse}
          icon={Clock3}
          status={
            feedback.needsResponse !== undefined && (
              <StatusBadge type="warning">
                Response needed
              </StatusBadge>
            )
          }
        />
      </Section>
      {selectedMetric && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMetric(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="operations-modal-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >

            <section className="space-y-4 border-b border-slate-200 p-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {selectedMetric.category === "issues"
                    ? "Community Reports"
                    : selectedMetric.category === "inquiries"
                      ? "Investor & Partner Inquiries"
                      : selectedMetric.category === "affiliates"
                        ? "Affiliate Records"
                        : selectedMetric.category === "payouts"
                          ? "Payout Requests"
                          : selectedMetric.category === "enrollments"
                            ? "Learner Enrollments"
                            : selectedMetric.category === "certificates"
                              ? "Certificate Records"
                              : selectedMetric.category === "payments"
                                ? "Payment Transactions"
                                : selectedMetric.category === "feedback"
                                  ? "Feedback & Testimonials"
                                  : "Records"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Data loaded from the protected KanuorieTech API.
                </p>
              </div>

              {recordsLoading && (
                <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                  Loading records…
                </p>
              )}

              {!recordsLoading && recordsError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {recordsError}
                  <button
                    type="button"
                    onClick={() => loadOperationRecords(selectedMetric.category)}
                    className="ml-2 font-semibold underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!recordsLoading &&
                !recordsError &&
                selectedMetric.category === "compliance" && (
                  <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                    Not configured. No dedicated compliance data source is connected.
                  </p>
                )}

              {!recordsLoading &&
                !recordsError &&
                selectedMetric.category === "none" && (
                  <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                    A dedicated record view is not configured for this metric yet.
                  </p>
                )}

              {!recordsLoading &&
                !recordsError &&
                !["none", "compliance"].includes(selectedMetric.category) &&
                operationRecords.length === 0 && (
                  <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                    No records were found.
                  </p>
                )}

              {!recordsLoading &&
                !recordsError &&
                operationRecords.map((record) => {
                  const person = (value) => {
                    if (!value) return "Unknown";
                    if (typeof value === "string") return value;

                    return [
                      value.firstName,
                      value.lastName,
                    ].filter(Boolean).join(" ") ||
                      value.name ||
                      value.email ||
                      "Unknown";
                  };

                  const date = (value) =>
                    value ? new Date(value).toLocaleString() : "—";

                  const status =
                    record.status ||
                    record.commissionStatus ||
                    (record.active === false ? "inactive" : "");

                  const statusOptions = {
                    affiliates: ["pending", "active", "suspended", "inactive"],
                    payouts: ["processing", "paid", "rejected"],
                    inquiries: ["new", "contacted", "in-progress", "completed", "cancelled"],
                    issues: ["pending", "reviewed", "dismissed", "actioned"],
                  };

                  const canUpdate = Boolean(statusOptions[selectedMetric.category]);

                  return (
                    <article
                      key={record._id}
                      className="space-y-3 rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="break-words font-semibold text-slate-900">
                            {selectedMetric.category === "affiliates"
                              ? person(record.user)
                              : selectedMetric.category === "payouts"
                                ? person(record.affiliate?.user)
                                : selectedMetric.category === "inquiries"
                                  ? record.name
                                  : selectedMetric.category === "enrollments"
                                    ? person(record.user)
                                    : selectedMetric.category === "certificates"
                                      ? record.recipientName
                                      : selectedMetric.category === "payments"
                                        ? person(record.user)
                                        : selectedMetric.category === "issues"
                                          ? record.post?.title || "Community report"
                                          : record.name || "Feedback"}
                          </h4>

                          <p className="mt-1 break-all text-sm text-slate-500">
                            {selectedMetric.category === "affiliates"
                              ? record.user?.email
                              : selectedMetric.category === "payouts"
                                ? record.affiliate?.user?.email
                                : selectedMetric.category === "inquiries"
                                  ? record.email
                                  : selectedMetric.category === "enrollments"
                                    ? record.user?.email
                                    : selectedMetric.category === "certificates"
                                      ? record.certificateId
                                      : selectedMetric.category === "payments"
                                        ? record.providerReference
                                        : selectedMetric.category === "issues"
                                          ? `${record.reason || "Report"} · ${person(record.reporter)}`
                                          : record.company || record.position || ""}
                          </p>
                        </div>

                        {status && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {String(status).replaceAll("_", " ")}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-slate-600">
                        {selectedMetric.category === "affiliates" && (
                          <>
                            <p>Referral code: {record.referralCode || "—"}</p>
                            <p>Commission rate: {record.commissionRate ?? 0}%</p>
                            <p>Joined: {date(record.createdAt)}</p>
                          </>
                        )}

                        {selectedMetric.category === "payouts" && (
                          <>
                            <p>Amount: {record.currency || "USD"} {Number(record.amount || 0).toLocaleString()}</p>
                            <p>Requested: {date(record.requestedAt || record.createdAt)}</p>
                            {record.reference && <p>Payment reference: {record.reference}</p>}
                            {record.rejectionReason && <p>Reason: {record.rejectionReason}</p>}
                          </>
                        )}

                        {selectedMetric.category === "inquiries" && (
                          <>
                            <p>Type: {record.inquiryType}</p>
                            <p>Company: {record.company || "—"}</p>
                            <p>Phone: {record.phone || "—"}</p>
                            <p>Subject: {record.subject}</p>
                            <p className="whitespace-pre-wrap break-words">{record.message}</p>
                            <p>Received: {date(record.createdAt)}</p>
                          </>
                        )}

                        {selectedMetric.category === "enrollments" && (
                          <>
                            <p>Course: {record.course?.title || "Course unavailable"}</p>
                            <p>Progress: {Number(record.percentage || 0)}%</p>
                            <p>Certificate issued: {record.certificateIssued ? "Yes" : "No"}</p>
                            <p>Last updated: {date(record.updatedAt)}</p>
                          </>
                        )}

                        {selectedMetric.category === "certificates" && (
                          <>
                            <p>Course: {record.courseTitle || record.course?.title || "—"}</p>
                            <p>Completed: {date(record.completionDate)}</p>
                            <p>Issued: {date(record.issuedAt)}</p>
                          </>
                        )}

                        {selectedMetric.category === "payments" && (
                          <>
                            <p>Amount: {record.currency || "USD"} {Number(record.amount || 0).toLocaleString()}</p>
                            <p>Provider: {record.provider || "—"}</p>
                            <p>Method: {record.paymentMethod || "—"}</p>
                            <p>Created: {date(record.createdAt)}</p>
                            <p>Paid: {date(record.paidAt)}</p>
                            {record.failureReason && <p>Failure reason: {record.failureReason}</p>}
                            <p className="font-medium text-slate-700">Read-only transaction record</p>
                          </>
                        )}

                        {selectedMetric.category === "issues" && (
                          <>
                            <p>Reported by: {person(record.reporter)} ({record.reporter?.email || "—"})</p>
                            <p>Reason: {record.reason}</p>
                            <p className="whitespace-pre-wrap break-words">{record.details || "No additional details."}</p>
                            <p>Reported: {date(record.createdAt)}</p>
                          </>
                        )}

                        {selectedMetric.category === "feedback" && (
                          <>
                            <p>Rating: {record.rating ?? "—"} / 5</p>
                            <p className="whitespace-pre-wrap break-words">{record.message}</p>
                            <p>Received: {date(record.createdAt)}</p>
                            <p>Visibility: {record.active ? "Active" : "Inactive"}</p>
                          </>
                        )}
                      </div>

                      {canUpdate && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                          <label
                            htmlFor={`operation-status-${record._id}`}
                            className="text-xs font-medium text-slate-600"
                          >
                            Update status
                          </label>

                          <select
                            id={`operation-status-${record._id}`}
                            value={status}
                            disabled={actionLoading === record._id}
                            onChange={(event) =>
                              handleRecordAction(record, event.target.value)
                            }
                            className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
                          >
                            {!statusOptions[selectedMetric.category].includes(status) && (
                              <option value={status}>{status || "Unknown"}</option>
                            )}

                            {statusOptions[selectedMetric.category].map((option) => (
                              <option
                                key={option}
                                value={option}
                                disabled={
                                  selectedMetric.category === "payouts" &&
                                  ["paid", "rejected"].includes(status)
                                }
                              >
                                {option.replaceAll("-", " ").replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>

                          {actionLoading === record._id && (
                            <span className="text-xs text-slate-500">Saving…</span>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
            </section>

            <div className="border-t border-slate-200 p-4 text-right">
              <button
                type="button"
                onClick={() => setSelectedMetric(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
