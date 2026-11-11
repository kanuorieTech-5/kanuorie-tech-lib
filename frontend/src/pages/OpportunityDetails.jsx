
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  RefreshCw,
  Share2,
  Tag,
} from "lucide-react";
import { getPublicOpportunity } from "../services/opportunity.service";

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isExpired = (deadline) => {
  if (!deadline) return false;

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;

  date.setHours(23, 59, 59, 999);
  return date < new Date();
};

const DetailSection = ({ title, items }) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
          >
            <CheckCircle2
              size={18}
              className="mt-1 shrink-0 text-blue-600 dark:text-blue-400"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default function OpportunityDetails() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOpportunity = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicOpportunity(id);
        const result = response?.data ?? response;

        if (active) {
          setOpportunity(result);
        }
      } catch (err) {
        console.error("Failed to load opportunity:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "This opportunity could not be found or is no longer available."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOpportunity();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <RefreshCw size={34} className="animate-spin text-blue-600" />
      </main>
    );
  }

  if (error || !opportunity) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <BriefcaseBusiness
            size={44}
            className="mx-auto text-slate-300"
          />
          <h1 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
            Opportunity unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {error || "We couldn't find this opportunity."}
          </p>
          <Link
            to="/opportunities"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            Browse opportunities
          </Link>
        </div>
      </main>
    );
  }

  const expired = isExpired(opportunity.deadline);
  const closed = opportunity.status === "closed";
  const cannotApply = expired || closed;

  const applicationLink = opportunity.applicationUrl?.trim();
  const applicationEmail = opportunity.applicationEmail?.trim();

  return (
    <main className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-14 text-white sm:px-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            All opportunities
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-xs font-bold capitalize text-blue-200">
              {(opportunity.type || "other").replace("-", " ")}
            </span>

            {opportunity.featured && (
              <span className="rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-bold text-amber-200">
                Featured opportunity
              </span>
            )}

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                cannotApply
                  ? "bg-red-500/20 text-red-200"
                  : "bg-emerald-500/20 text-emerald-200"
              }`}
            >
              {closed ? "Closed" : expired ? "Deadline passed" : "Open"}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            {opportunity.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <Building2 size={17} />
              {opportunity.organization}
            </span>

            <span className="inline-flex items-center gap-2">
              <MapPin size={17} />
              {opportunity.location || "Not specified"}
            </span>

            {opportunity.workMode &&
              opportunity.workMode !== "not-applicable" && (
                <span className="capitalize">
                  {opportunity.workMode}
                </span>
              )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-16">
        {/* Main information */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              About this opportunity
            </h2>

            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600 dark:text-slate-300">
              {opportunity.description}
            </p>
          </section>

          <DetailSection
            title="Requirements and eligibility"
            items={opportunity.requirements}
          />

          <DetailSection
            title="Benefits"
            items={opportunity.benefits}
          />

          {Array.isArray(opportunity.tags) &&
            opportunity.tags.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Related tags
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {opportunity.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
        </div>

        {/* Application sidebar */}
        <aside className="space-y-5">
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Opportunity overview
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={19}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Application deadline
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(opportunity.deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BriefcaseBusiness
                  size={19}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Opportunity type
                  </p>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {(opportunity.type || "other").replace("-", " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {opportunity.location || "Not specified"}
                  </p>
                </div>
              </div>

              {opportunity.workMode &&
                opportunity.workMode !== "not-applicable" && (
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={19}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Work arrangement
                      </p>
                      <p className="mt-1 text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                        {opportunity.workMode}
                      </p>
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6 dark:border-slate-800">
              {cannotApply ? (
                <div className="rounded-xl bg-red-50 p-4 text-center text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  {closed
                    ? "Applications for this opportunity are closed."
                    : "The application deadline has passed."}
                </div>
              ) : applicationLink ? (
                <a
                  href={applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Apply now
                  <ArrowUpRight size={17} />
                </a>
              ) : applicationEmail ? (
                <a
                  href={`mailto:${applicationEmail}?subject=${encodeURIComponent(
                    `Application: ${opportunity.title}`
                  )}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Apply by email
                  <Mail size={17} />
                </a>
              ) : (
                <div className="rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  Application instructions have not been provided yet.
                </div>
              )}

              {opportunity.sourceUrl && (
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Original announcement
                  <ExternalLink size={15} />
                </a>
              )}

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                  } catch (error) {
                    console.error("Unable to copy opportunity link:", error);
                  }
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Share2 size={16} />
                Share opportunity
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
