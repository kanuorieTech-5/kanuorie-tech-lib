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
} from "lucide-react";

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

  /*
   * Backend may return:
   *
   * 1250
   *
   * or:
   *
   * {
   *   USD: 1250,
   *   NGN: 50000
   * }
   *
   * We keep currencies separate rather than adding
   * different currencies together.
   */

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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

  const complianceConfigured = compliance.configured !== false;

  return (
    <div className="space-y-8">
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
    </div>
  );
}
