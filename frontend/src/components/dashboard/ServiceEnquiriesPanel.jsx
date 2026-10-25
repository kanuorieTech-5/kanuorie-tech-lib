import { useCallback, useEffect, useState } from "react";
import {
  getAdminServiceEnquiries,
  getAdminServiceEnquiryStats,
  updateAdminServiceEnquiryStatus,
} from "../../api/contactApi";

const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const cards = [
  { key: "total", label: "Total Enquiries" },
  { key: "new", label: "New" },
  { key: "inProgress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response ?? {};
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function statusClass(status) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "contacted":
      return "bg-violet-100 text-violet-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export default function ServiceEnquiriesPanel() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");
  const [selected, setSelected] = useState(null);

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { limit: 100 };
      if (filter !== "all") params.status = filter;
      if (search.trim()) params.search = search.trim();

      const [listResponse, statsResponse] = await Promise.all([
        getAdminServiceEnquiries(params),
        getAdminServiceEnquiryStats(),
      ]);

      const listData = unwrap(listResponse);
      const statsData = unwrap(statsResponse);

      setEnquiries(Array.isArray(listData) ? listData : listData?.data || []);
      setStats(statsData && typeof statsData === "object" ? statsData : {});
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load service enquiries. Check your admin access and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const changeStatus = async (id, status) => {
    try {
      setSavingId(id);
      setError("");

      await updateAdminServiceEnquiryStatus(id, status);

      setSelected((current) =>
        current?._id === id ? { ...current, status } : current
      );

      await loadEnquiries();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to update this enquiry's status."
      );
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Client Requests
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Service Enquiries
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Review project requests and track each enquiry's progress.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          disabled={loading}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {Number(stats[card.key] ?? 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search client, email, service, or budget..."
          aria-label="Search service enquiries"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter enquiries by status"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All statuses</option>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading service enquiries...
        </div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            No service enquiries found
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            New requests submitted through the service enquiry form will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-4">Client</th>
                <th className="px-4 py-4">Service / Budget</th>
                <th className="px-4 py-4">Received</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {enquiry.name}
                    </p>
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="mt-1 block text-cyan-700 hover:underline dark:text-cyan-400"
                    >
                      {enquiry.email}
                    </a>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {enquiry.subject === "Business owner service request"
                        ? "Business owner signup"
                        : enquiry.service || enquiry.subject || "—"}
                    </p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      {enquiry.company || enquiry.budget || enquiry.projectType || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                    {formatDate(enquiry.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={enquiry.status || "new"}
                      disabled={savingId === enquiry._id}
                      onChange={(event) =>
                        changeStatus(enquiry._id, event.target.value)
                      }
                      aria-label={`Update status for ${enquiry.name}`}
                      className={`rounded-full px-3 py-2 text-xs font-semibold outline-none disabled:opacity-50 ${statusClass(enquiry.status)}`}
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelected(enquiry)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      View project
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-dialog-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                  Service Enquiry
                </p>
                <h3
                  id="enquiry-dialog-title"
                  className="mt-1 text-2xl font-bold text-slate-900 dark:text-white"
                >
                  {selected.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close enquiry details"
                className="rounded-lg px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Email</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="mt-1 block break-all font-medium text-cyan-700 dark:text-cyan-400"
                >
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Service</p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {selected.service || selected.subject || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Budget</p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {selected.budget || "Not provided"}
                </p>
              </div>
              {selected.company && (
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Business type</p>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">
                    {selected.company}
                  </p>
                </div>
              )}
              {selected.timeline && (
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Preferred timeline</p>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">
                    {selected.timeline}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Submitted</p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {formatDate(selected.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Project details</p>
              <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate-700 dark:text-slate-300">
                {selected.message}
              </p>
            </div>

            {selected.projectRequirements?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Requested services</p>
                <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">
                  {selected.projectRequirements.join(", ")}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || "Service enquiry"}`)}`}
                className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Email client
              </a>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
