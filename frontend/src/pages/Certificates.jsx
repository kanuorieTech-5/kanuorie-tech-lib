import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  FileBadge2,
  Loader2,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getCertificates } from "../services";
import { Card } from "../components/common";

/* ==========================================
   HELPERS
========================================== */

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getCertificateId = (certificate) =>
  certificate?.certificateId || certificate?._id || "";

const getCourseTitle = (certificate) =>
  certificate?.courseTitle ||
  certificate?.course?.title ||
  "Completed Course";

const getRecipientName = (certificate) =>
  certificate?.recipientName || "Certificate Recipient";

const getInstructor = (certificate) =>
  certificate?.instructor ||
  certificate?.course?.instructor ||
  "KanuorieTech";

/* ==========================================
   CERTIFICATE PREVIEW
========================================== */

function CertificatePreview({ certificate, onClose }) {
  const certificateId = getCertificateId(certificate);

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = `${window.location.origin}/verify-certificate/${encodeURIComponent(
    certificateId,
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex min-h-full max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* MODAL HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Certificate
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                {getCourseTitle(certificate)}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" />
                Print / PDF
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close certificate"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* CERTIFICATE */}

          <div className="bg-slate-100 p-4 sm:p-8">
            <div
              id="certificate-print"
              className="relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden border-[10px] border-slate-900 bg-white shadow-xl sm:border-[14px]"
            >
              {/* DECORATIVE BACKGROUND */}

              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />

                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-100 blur-3xl" />

                <div className="absolute inset-4 border border-blue-200 sm:inset-7" />

                <div className="absolute inset-7 border border-slate-200 sm:inset-10" />
              </div>

              {/* CONTENT */}

              <div className="relative flex h-full flex-col items-center justify-between px-8 py-7 text-center sm:px-16 sm:py-12">
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-yellow-400 sm:h-16 sm:w-16">
                    <Award className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-blue-600 sm:text-xs">
                    KanuorieTech
                  </p>

                  <h1 className="mt-2 font-serif text-xl font-bold text-slate-900 sm:text-4xl">
                    Certificate of Completion
                  </h1>

                  <div className="mt-2 h-0.5 w-16 bg-yellow-500 sm:w-24" />
                </div>

                <div className="w-full">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                    This certificate is proudly presented to
                  </p>

                  <h2 className="mt-2 break-words font-serif text-xl font-bold text-slate-900 sm:text-4xl">
                    {getRecipientName(certificate)}
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-[8px] leading-relaxed text-slate-600 sm:text-sm">
                    For successfully completing the course
                  </p>

                  <h3 className="mx-auto mt-1 max-w-3xl break-words text-sm font-bold text-blue-700 sm:text-2xl">
                    {getCourseTitle(certificate)}
                  </h3>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-3 items-end gap-3 sm:gap-8">
                    <div className="border-t border-slate-300 pt-1 sm:pt-2">
                      <p className="text-[7px] font-semibold text-slate-900 sm:text-xs">
                        {formatDate(
                          certificate?.completionDate ||
                            certificate?.issuedAt,
                        )}
                      </p>

                      <p className="text-[6px] uppercase tracking-wider text-slate-400 sm:text-[9px]">
                        Completion Date
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-500 sm:h-14 sm:w-14">
                        <BadgeCheck className="h-5 w-5 text-blue-600 sm:h-8 sm:w-8" />
                      </div>

                      <p className="mt-1 text-[6px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                        Verified
                      </p>
                    </div>

                    <div className="border-t border-slate-300 pt-1 text-center sm:pt-2">
                      <p className="text-[7px] font-semibold text-slate-900 sm:text-xs">
                        {getInstructor(certificate)}
                      </p>

                      <p className="text-[6px] uppercase tracking-wider text-slate-400 sm:text-[9px]">
                        Instructor
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-[6px] text-slate-400 sm:mt-5 sm:text-[9px]">
                    Certificate ID: {certificateId}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERIFICATION */}

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />

              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Certificate ID
                </p>

                <p className="truncate text-xs text-slate-500">
                  {certificateId}
                </p>
              </div>
            </div>

            <Link
              to={`/verify-certificate/${encodeURIComponent(certificateId)}`}
              onClick={onClose}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Verify Certificate
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* PRINT STYLES */}

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #certificate-print,
          #certificate-print * {
            visibility: visible !important;
          }

          #certificate-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ==========================================
   CERTIFICATES PAGE
========================================== */

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  useEffect(() => {
    let mounted = true;

    const loadCertificates = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await getCertificates();

        const data =
          response?.data ??
          (Array.isArray(response) ? response : []);

        if (mounted) {
          setCertificates(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Certificates loading error:", error);

        if (mounted) {
          setErrorMessage(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load your certificates.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCertificates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return certificates;
    }

    return certificates.filter((certificate) => {
      const courseTitle = getCourseTitle(certificate).toLowerCase();
      const certificateId =
        getCertificateId(certificate).toLowerCase();

      return (
        courseTitle.includes(query) ||
        certificateId.includes(query)
      );
    });
  }, [certificates, searchQuery]);

  const statistics = useMemo(() => {
    const issued = certificates.filter(
      (certificate) => certificate?.status === "issued",
    ).length;

    const revoked = certificates.filter(
      (certificate) => certificate?.status === "revoked",
    ).length;

    const latest = certificates.reduce(
      (currentLatest, certificate) => {
        const date = new Date(
          certificate?.issuedAt ||
            certificate?.completionDate ||
            0,
        );

        if (!currentLatest || date > currentLatest) {
          return date;
        }

        return currentLatest;
      },
      null,
    );

    return {
      total: certificates.length,
      issued,
      revoked,
      latest:
        latest && !Number.isNaN(latest.getTime())
          ? latest
          : null,
    };
  }, [certificates]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================
            HEADER
        ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            <Sparkles className="h-4 w-4" />
            Achievements
          </p>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                My Certificates
              </h1>

              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                View, verify, and print certificates you have earned
                through your KanuorieTech learning journey.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Explore Courses
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Certificates",
              value: statistics.total,
              icon: Award,
              description: "Earned certificates",
            },
            {
              label: "Issued",
              value: statistics.issued,
              icon: BadgeCheck,
              description: "Currently valid",
            },
            {
              label: "Revoked",
              value: statistics.revoked,
              icon: FileBadge2,
              description: "Revoked certificates",
            },
            {
              label: "Latest",
              value: statistics.latest
                ? statistics.latest.toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )
                : "—",
              icon: CalendarDays,
              description: "Most recent issue",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {stat.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search certificates..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {!loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredCertificates.length}{" "}
              {filteredCertificates.length === 1
                ? "certificate"
                : "certificates"}
            </p>
          )}
        </div>

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Loading your certificates...
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Unable to load certificates
                </p>

                <p className="mt-1 text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {!loading &&
          !errorMessage &&
          filteredCertificates.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
                <Award className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                {searchQuery
                  ? "No matching certificates"
                  : "Your certificates will appear here"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try another course title or certificate ID."
                  : "Complete an eligible KanuorieTech course to earn your first certificate."}
              </p>

              {!searchQuery && (
                <Link
                  to="/courses"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Browse Courses
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}

        {/* ======================================
            CERTIFICATE GRID
        ====================================== */}

        {!loading &&
          !errorMessage &&
          filteredCertificates.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCertificates.map(
                (certificate, index) => {
                  const certificateId =
                    getCertificateId(certificate);

                  const status =
                    certificate?.status || "issued";

                  return (
                    <motion.div
                      key={
                        certificate?._id ||
                        certificateId ||
                        index
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                    >
                      <Card className="group overflow-hidden rounded-3xl border-gray-200 bg-white p-0 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        {/* VISUAL */}

                        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
                          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

                          <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-yellow-400/10 blur-2xl" />

                          <div className="relative flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-yellow-400 backdrop-blur">
                              <Award className="h-6 w-6" />
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                status === "issued"
                                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                  : "border-red-400/20 bg-red-400/10 text-red-300"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {status === "issued"
                                ? "Issued"
                                : "Revoked"}
                            </span>
                          </div>

                          <div className="relative mt-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                              KanuorieTech
                            </p>

                            <h2 className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-bold text-white">
                              {getCourseTitle(
                                certificate,
                              )}
                            </h2>
                          </div>
                        </div>

                        {/* CONTENT */}

                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/50">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Recipient
                                </p>

                                <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {getRecipientName(
                                    certificate,
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-yellow-50 p-2.5 text-yellow-600 dark:bg-yellow-950/30">
                                <CalendarDays className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Completion Date
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                  {formatDate(
                                    certificate?.completionDate ||
                                      certificate?.issuedAt,
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-950">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                Certificate ID
                              </p>

                              <p className="mt-1 break-all font-mono text-xs text-gray-600 dark:text-gray-300">
                                {certificateId || "Unavailable"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCertificate(
                                  certificate,
                                )
                              }
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              <Award className="h-4 w-4" />
                              View Certificate
                            </button>

                            <Link
                              to={`/verify-certificate/${encodeURIComponent(
                                certificateId,
                              )}`}
                              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3.5 text-gray-600 transition hover:bg-gray-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                              title="Verify certificate"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                },
              )}
            </div>
          )}
      </div>

      {/* ======================================
          CERTIFICATE MODAL
      ====================================== */}

      {selectedCertificate && (
        <CertificatePreview
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
