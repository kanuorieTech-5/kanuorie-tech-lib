import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import {
  getAllPublicOpportunities,
  getPublicOpportunity,
} from "../api/opportunityApi";
import { submitCareerApplication } from "../api/careerApplicationApi";
import TeamApplicationForm from "../components/forms/TeamApplicationForm";

const unwrap = (response) => {
  const result = response?.data ?? response;
  return result?.opportunity ?? result?.item ?? result;
};
const asList = (value) =>
  Array.isArray(value)
    ? value.filter(Boolean)
    : typeof value === "string"
      ? value
          .split(/\n|,/)
          .map((x) => x.trim())
          .filter(Boolean)
      : [];
const titleCase = (value) =>
  String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (x) => x.toUpperCase());
const deadline = (value) => {
  if (!value) return "No deadline listed";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "No deadline listed"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

export default function CareerDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationError, setApplicationError] = useState("");

  useEffect(() => {
    let active = true;
    getAllPublicOpportunities()
      .then((items) => {
        if (active) setOpportunities(items);
      })
      .catch((err) => {
        console.error("Failed to load published opportunities:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = unwrap(await getPublicOpportunity(id));
        if (!result || result.published === false)
          throw new Error("This opportunity is not available.");
        if (active) setItem(result);
      } catch (err) {
        if (active)
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "We couldn't load this opportunity.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const submit = async (form) => {
    if (!item || submitting) return;
    setSubmitting(true);
    setApplicationError("");
    try {
      await submitCareerApplication({ ...form, position: item.title });
      setSubmitted(true);
    } catch (err) {
      setApplicationError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const requirements = asList(item?.requirements);
  const benefits = asList(item?.benefits);
  const tags = asList(item?.tags);
  const workMode =
    item?.workMode && item.workMode !== "not-applicable"
      ? titleCase(item.workMode)
      : "";
  const applyUrl = item?.applicationUrl?.trim?.() || "";
  const applyEmail = item?.applicationEmail?.trim?.() || "";

  if (loading)
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-300">
          Loading opportunity…
        </p>
      </main>
    );
  if (error || !item)
    return (
      <main className="min-h-[60vh] bg-slate-50 px-5 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <BriefcaseBusiness className="mx-auto h-10 w-10 text-blue-600 dark:text-blue-400" />
          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Opportunity unavailable
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            {error || "This opportunity could not be found."}
          </p>
          <Link
            to="/careers"
            className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to careers
          </Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.28),transparent_38%),radial-gradient(circle_at_85%_75%,rgba(99,102,241,0.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All opportunities
          </Link>
          <div className="mt-9 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-200">
            <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5">
              {titleCase(item.type || "Opportunity")}
            </span>
            {item.featured && (
              <span className="rounded-full bg-amber-300/15 px-3 py-1.5 text-amber-200">
                Featured
              </span>
            )}
            {item.category && (
              <span className="text-slate-300">{item.category}</span>
            )}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {item.title}
          </h1>
          {item.organization && (
            <p className="mt-4 text-lg font-semibold text-blue-200">
              {item.organization}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            {item.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-300" />
                {item.location}
              </span>
            )}
            {workMode && (
              <span className="inline-flex items-center gap-2">
                <Laptop className="h-4 w-4 text-blue-300" />
                {workMode}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-300" />
              Deadline: {deadline(item.deadline)}
            </span>
          </div>
          <div className="mt-9">
            {applyUrl ? (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500"
              >
                Apply for this opportunity <ExternalLink className="h-4 w-4" />
              </a>
            ) : applyEmail ? (
              <a
                href={
                  "mailto:" +
                  applyEmail +
                  "?subject=" +
                  encodeURIComponent("Application: " + item.title)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500"
              >
                Apply by email <Mail className="h-4 w-4" />
              </a>
            ) : (
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500"
              >
                Apply for this opportunity <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-16">
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold">About this opportunity</h2>
            <p className="mt-5 whitespace-pre-line leading-8 text-slate-600 dark:text-slate-300">
              {item.description ||
                "More details will be shared by the opportunity provider."}
            </p>
          </section>
          {requirements.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="mt-5 space-y-3">
                {requirements.map((text, i) => (
                  <li
                    key={i}
                    className="flex gap-3 leading-7 text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {benefits.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold">What you’ll gain</h2>
              <ul className="mt-5 space-y-3">
                {benefits.map((text, i) => (
                  <li
                    key={i}
                    className="flex gap-3 leading-7 text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!applyUrl && !applyEmail && (
            <section
              id="apply"
              className="scroll-mt-24 rounded-3xl border border-blue-200 bg-blue-50/70 p-6 sm:p-9 dark:border-blue-900 dark:bg-blue-950/30"
            >
              {submitted ? (
                <div className="py-5 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="mt-4 text-2xl font-bold">
                    Application received
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    Thanks for applying. The team will review your information.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-start gap-3">
                    <Send className="mt-1 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="text-2xl font-bold">
                        Apply for this opportunity
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Share your details and a link to your work with the
                        KanuorieTech team.
                      </p>
                    </div>
                  </div>
                  {applicationError && (
                    <p
                      role="alert"
                      className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    >
                      {applicationError}
                    </p>
                  )}
                  <TeamApplicationForm loading={submitting} onSubmit={submit} />
                </>
              )}
            </section>
          )}
        </div>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Opportunity summary</h2>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              ["Type", titleCase(item.type || "Other")],
              ["Organization", item.organization || "KanuorieTech"],
              ["Location", item.location || "Not specified"],
              ["Work mode", workMode || "Not specified"],
              ["Deadline", deadline(item.deadline)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          {tags.length > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Skills and topics
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400"
            >
              View original listing <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </aside>
      </div>

      {opportunities.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:pb-20">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Explore more
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                All published opportunities
              </h2>
            </div>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Browse careers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => {
              const opportunityId =
                opportunity.slug || opportunity._id || opportunity.id;
              const isCurrent =
                String(
                  opportunity._id || opportunity.id || opportunity.slug,
                ) === String(item._id || item.id || item.slug) ||
                String(opportunity.slug) === String(item.slug);

              return (
                <Link
                  key={opportunityId}
                  to={`/careers/${encodeURIComponent(opportunityId)}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`group rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${
                    isCurrent
                      ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40"
                      : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {titleCase(opportunity.type || "Opportunity")}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 transition group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                    {opportunity.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {opportunity.organization || "KanuorieTech"}
                    {opportunity.location ? ` · ${opportunity.location}` : ""}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400">
                    View opportunity{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
