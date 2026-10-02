import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import { verifyCertificate } from "../services";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(certificateId || "");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(Boolean(certificateId));
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchId(certificateId || "");

    if (!certificateId) {
      setCertificate(null);
      setError("");
      setLoading(false);
      return;
    }

    const verify = async () => {
      setLoading(true);
      setError("");
      setCertificate(null);

      try {
        const response = await verifyCertificate(
          decodeURIComponent(certificateId)
        );

        const data = response?.data;

        if (!data?.certificate) {
          throw new Error(
            response?.message || "Certificate could not be verified."
          );
        }

        setCertificate(data.certificate);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Certificate not found or invalid."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [certificateId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = searchId.trim();

    if (!value) {
      setError("Please enter a certificate ID.");
      return;
    }

    navigate(
      `/verify-certificate/${encodeURIComponent(value)}`
    );
  };

  const isValid = certificate?.status === "issued";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>

          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            <Sparkles className="h-4 w-4" />
            KanuorieTech
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Certificate Verification
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Verify the authenticity of a KanuorieTech certificate using
            its unique certificate ID.
          </p>
        </motion.div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onSubmit={handleSubmit}
          className="mx-auto mb-8 max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchId}
                onChange={(event) => {
                  setSearchId(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter certificate ID e.g. KT-2026-ABC123"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:shadow-blue-500/30"
            >
              <ShieldCheck className="h-5 w-5" />
              Verify
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </motion.form>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur-xl"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-400" />

            <p className="text-sm text-slate-300">
              Verifying certificate...
            </p>
          </motion.div>
        )}

        {/* Certificate Result */}
        {!loading && certificate && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"
          >
            {/* Status Banner */}
            <div
              className={`flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${
                isValid
                  ? "bg-gradient-to-r from-emerald-600 to-green-500"
                  : "bg-gradient-to-r from-red-600 to-rose-500"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                {isValid ? (
                  <BadgeCheck className="h-8 w-8" />
                ) : (
                  <XCircle className="h-8 w-8" />
                )}

                <div>
                  <p className="text-lg font-bold">
                    {isValid
                      ? "Certificate Verified"
                      : "Certificate Revoked"}
                  </p>

                  <p className="text-sm text-white/80">
                    {isValid
                      ? "This certificate is valid and was issued by KanuorieTech."
                      : "This certificate is no longer considered valid."}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
                {certificate.status || "unknown"}
              </span>
            </div>

            {/* Certificate Details */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <Award className="h-5 w-5" />
                    KanuorieTech Certificate
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {certificate.courseTitle || "Course Certificate"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Certificate ID:{" "}
                    <span className="font-semibold text-slate-700">
                      {certificate.certificateId}
                    </span>
                  </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                  <CheckCircle2
                    className={`h-9 w-9 ${
                      isValid
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Recipient
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {certificate.recipientName || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Instructor
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {certificate.instructor || "KanuorieTech"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Completion Date
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {formatDate(certificate.completionDate)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Issued Date
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>
              </div>

              {/* Course Information */}
              {certificate.course && (
                <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                  <h3 className="mb-4 font-bold text-slate-900">
                    Course Information
                  </h3>

                  <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    {certificate.course.category && (
                      <div>
                        <p className="text-slate-400">Category</p>
                        <p className="mt-1 font-semibold text-slate-700">
                          {certificate.course.category}
                        </p>
                      </div>
                    )}

                    {certificate.course.level && (
                      <div>
                        <p className="text-slate-400">Level</p>
                        <p className="mt-1 font-semibold text-slate-700">
                          {certificate.course.level}
                        </p>
                      </div>
                    )}

                    {certificate.course.duration && (
                      <div>
                        <p className="text-slate-400">Duration</p>
                        <p className="mt-1 font-semibold text-slate-700">
                          {certificate.course.duration}
                        </p>
                      </div>
                    )}

                    {certificate.course.language && (
                      <div>
                        <p className="text-slate-400">Language</p>
                        <p className="mt-1 font-semibold text-slate-700">
                          {certificate.course.language}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 text-center sm:px-8">
              <p className="text-xs leading-5 text-slate-500">
                This verification result is provided by KanuorieTech.
                The certificate ID above can be used to independently
                verify this credential.
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !certificate && !error && !certificateId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur-xl"
          >
            <Award className="mx-auto mb-4 h-12 w-12 text-blue-300" />

            <h2 className="text-xl font-bold text-white">
              Enter a Certificate ID
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Enter the unique certificate ID printed on a KanuorieTech
              certificate to verify its authenticity.
            </p>
          </motion.div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} KanuorieTech. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyCertificate;


