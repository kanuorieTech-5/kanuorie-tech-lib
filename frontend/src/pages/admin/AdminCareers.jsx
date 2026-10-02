import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Card, Button, Loader } from "../../components/common";

import {
  deleteCareerApplication,
  getCareerApplicationStats,
  getCareerApplications,
  markCareerApplicationRead,
  markCareerApplicationUnread,
  updateCareerApplicationNotes,
  updateCareerApplicationStatus,
} from "../../api";


const STATUSES = [
  "New",
  "Reviewing",
  "Shortlisted",
  "Interview",
  "Accepted",
  "Rejected",
];


const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700",
  Reviewing: "bg-amber-50 text-amber-700",
  Shortlisted: "bg-purple-50 text-purple-700",
  Interview: "bg-indigo-50 text-indigo-700",
  Accepted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};


export default function AdminCareers() {
  const [applications, setApplications] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    statuses: {
      new: 0,
      reviewing: 0,
      shortlisted: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");


  /* ==========================================
     LOAD DATA
  ========================================== */

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = {
        page: 1,
        limit: 100,
      };

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const [applicationsResponse, statsResponse] =
        await Promise.all([
          getCareerApplications(params),
          getCareerApplicationStats(),
        ]);

      const applicationData =
        applicationsResponse?.data?.data ??
        applicationsResponse?.data ??
        applicationsResponse ??
        [];

      const statsData =
        statsResponse?.data?.data ??
        statsResponse?.data ??
        statsResponse ??
        {};

      setApplications(
        Array.isArray(applicationData)
          ? applicationData
          : [],
      );

      setStats({
        total: Number(statsData?.total || 0),
        unread: Number(statsData?.unread || 0),
        statuses: {
          new: Number(statsData?.statuses?.new || 0),
          reviewing: Number(
            statsData?.statuses?.reviewing || 0,
          ),
          shortlisted: Number(
            statsData?.statuses?.shortlisted || 0,
          ),
          interview: Number(
            statsData?.statuses?.interview || 0,
          ),
          accepted: Number(
            statsData?.statuses?.accepted || 0,
          ),
          rejected: Number(
            statsData?.statuses?.rejected || 0,
          ),
        },
      });
    } catch (err) {
      console.error(
        "Failed to load career applications:",
        err,
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load career applications.";

      setError(message);

      if (isRefresh) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter]);


  useEffect(() => {
    loadData();
  }, [loadData]);


  /* ==========================================
     OPEN APPLICATION
  ========================================== */

  const openApplication = async (application) => {
    const id = application?._id || application?.id;

    if (!id) return;

    try {
      let currentApplication = application;

      if (!application.coverLetter) {
        const response =
          await getCareerApplication(id);

        currentApplication =
          response?.data?.data ??
          response?.data ??
          response;
      }

      setSelectedApplication(currentApplication);
      setNotes(currentApplication?.notes || "");

      if (!currentApplication?.isRead) {
        await markCareerApplicationRead(id);

        setApplications((current) =>
          current.map((item) =>
            (item?._id || item?.id) === id
              ? {
                  ...item,
                  isRead: true,
                }
              : item,
          ),
        );

        setStats((current) => ({
          ...current,
          unread: Math.max(
            0,
            Number(current.unread || 0) - 1,
          ),
        }));
      }
    } catch (err) {
      console.error(
        "Failed to open career application:",
        err,
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to open this application.",
      );
    }
  };


  /* ==========================================
     CLOSE APPLICATION
  ========================================== */

  const closeApplication = () => {
    setSelectedApplication(null);
    setNotes("");
  };


  /* ==========================================
     UPDATE STATUS
  ========================================== */

  const handleStatusChange = async (
    application,
    status,
  ) => {
    const id = application?._id || application?.id;

    if (!id || !status) return;

    try {
      setUpdatingStatusId(id);

      const response =
        await updateCareerApplicationStatus(
          id,
          status,
        );

      const updated =
        response?.data?.data ??
        response?.data ??
        response;

      setApplications((current) =>
        current.map((item) =>
          (item?._id || item?.id) === id
            ? {
                ...item,
                ...updated,
                status,
              }
            : item,
        ),
      );

      setSelectedApplication((current) =>
        current &&
        (current?._id || current?.id) === id
          ? {
              ...current,
              ...updated,
              status,
            }
          : current,
      );

      toast.success("Application status updated.");
    } catch (err) {
      console.error(
        "Failed to update application status:",
        err,
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to update application status.",
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };


  /* ==========================================
     SAVE NOTES
  ========================================== */

  const handleSaveNotes = async () => {
    const id =
      selectedApplication?._id ||
      selectedApplication?.id;

    if (!id) return;

    try {
      setSavingNotes(true);

      const response =
        await updateCareerApplicationNotes(
          id,
          notes,
        );

      const updated =
        response?.data?.data ??
        response?.data ??
        response;

      setSelectedApplication((current) => ({
        ...current,
        ...updated,
        notes,
      }));

      setApplications((current) =>
        current.map((item) =>
          (item?._id || item?.id) === id
            ? {
                ...item,
                notes,
              }
            : item,
        ),
      );

      toast.success("Notes saved.");
    } catch (err) {
      console.error(
        "Failed to save application notes:",
        err,
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to save notes.",
      );
    } finally {
      setSavingNotes(false);
    }
  };


  /* ==========================================
     TOGGLE READ STATUS
  ========================================== */

  const toggleReadStatus = async (application) => {
    const id = application?._id || application?.id;

    if (!id) return;

    try {
      if (application.isRead) {
        await markCareerApplicationUnread(id);

        setApplications((current) =>
          current.map((item) =>
            (item?._id || item?.id) === id
              ? {
                  ...item,
                  isRead: false,
                }
              : item,
          ),
        );

        setStats((current) => ({
          ...current,
          unread: Number(current.unread || 0) + 1,
        }));

        setSelectedApplication((current) =>
          current &&
          (current?._id || current?.id) === id
            ? {
                ...current,
                isRead: false,
              }
            : current,
        );

        toast.success("Application marked as unread.");
      } else {
        await markCareerApplicationRead(id);

        setApplications((current) =>
          current.map((item) =>
            (item?._id || item?.id) === id
              ? {
                  ...item,
                  isRead: true,
                }
              : item,
          ),
        );

        setStats((current) => ({
          ...current,
          unread: Math.max(
            0,
            Number(current.unread || 0) - 1,
          ),
        }));

        setSelectedApplication((current) =>
          current &&
          (current?._id || current?.id) === id
            ? {
                ...current,
                isRead: true,
              }
            : current,
        );

        toast.success("Application marked as read.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Unable to update read status.",
      );
    }
  };


  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (application) => {
    const id = application?._id || application?.id;

    if (!id) return;

    const confirmed = window.confirm(
      `Delete the application from ${
        application.fullName || "this applicant"
      }? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteCareerApplication(id);

      setApplications((current) =>
        current.filter(
          (item) =>
            (item?._id || item?.id) !== id,
        ),
      );

      if (
        selectedApplication &&
        (selectedApplication?._id ||
          selectedApplication?.id) === id
      ) {
        closeApplication();
      }

      setStats((current) => ({
        ...current,
        total: Math.max(
          0,
          Number(current.total || 0) - 1,
        ),
        unread:
          application.isRead
            ? Number(current.unread || 0)
            : Math.max(
                0,
                Number(current.unread || 0) - 1,
              ),
      }));

      toast.success("Application deleted.");
    } catch (err) {
      console.error(
        "Failed to delete application:",
        err,
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete application.",
      );
    } finally {
      setDeletingId(null);
    }
  };


  /* ==========================================
     SUMMARY
  ========================================== */

  const visibleApplications = useMemo(
    () => applications,
    [applications],
  );


  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader />

          <p className="mt-4 text-sm text-slate-500">
            Loading career applications...
          </p>
        </div>
      </div>
    );
  }


  /* ==========================================
     ERROR
  ========================================== */

  if (error) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Careers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage applications submitted through
            KanuorieTech Careers.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Unable to load applications
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <Button
            type="button"
            onClick={() => loadData()}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </section>
    );
  }


  return (
    <section className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Careers
              </h1>

              <p className="text-sm text-slate-500">
                Review and manage job applications.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => loadData(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={`mr-2 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </Button>
      </div>


      {/* STATS */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">
            Total Applications
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {stats.total}
            </p>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <BriefcaseBusiness size={22} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">
            Unread
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {stats.unread}
            </p>

            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <Mail size={22} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">
            Reviewing
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {stats.statuses.reviewing}
            </p>

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Clock3 size={22} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">
            Shortlisted
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {stats.statuses.shortlisted}
            </p>

            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </Card>
      </div>


      {/* FILTERS */}

      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search applicants, email or position..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">
              All statuses
            </option>

            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </Card>


      {/* APPLICATIONS */}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            Applications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {visibleApplications.length} application
            {visibleApplications.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {visibleApplications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <BriefcaseBusiness
              size={44}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No applications found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or status
              filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Position
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleApplications.map(
                  (application) => {
                    const id =
                      application?._id ||
                      application?.id;

                    const status =
                      application?.status || "New";

                    return (
                      <tr
                        key={id}
                        className={`transition hover:bg-slate-50 ${
                          !application?.isRead
                            ? "bg-blue-50/30"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              openApplication(
                                application,
                              )
                            }
                            className="flex items-center gap-3 text-left"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                              {String(
                                application?.fullName ||
                                  "A",
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p
                                className={`font-semibold ${
                                  application?.isRead
                                    ? "text-slate-900"
                                    : "text-blue-700"
                                }`}
                              >
                                {application?.fullName ||
                                  "Unnamed Applicant"}
                              </p>

                              <p className="text-sm text-slate-500">
                                {application?.email ||
                                  "No email"}
                              </p>
                            </div>
                          </button>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {application?.position ||
                            "General Application"}
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={status}
                            disabled={
                              updatingStatusId === id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                application,
                                event.target.value,
                              )
                            }
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${
                              STATUS_STYLES[
                                status
                              ] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {STATUSES.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {application?.createdAt
                            ? new Date(
                                application.createdAt,
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openApplication(
                                  application,
                                )
                              }
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                              title="View application"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleReadStatus(
                                  application,
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                              title={
                                application?.isRead
                                  ? "Mark unread"
                                  : "Mark read"
                              }
                            >
                              {application?.isRead ? (
                                <EyeOff size={17} />
                              ) : (
                                <Eye size={17} />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  application,
                                )
                              }
                              disabled={
                                deletingId === id
                              }
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              title="Delete application"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>


      {/* APPLICATION DETAILS MODAL */}

      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeApplication();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <UserRound size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedApplication.fullName}
                  </h2>

                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="mt-1 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Mail size={15} />

                    {selectedApplication.email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={closeApplication}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={21} />
              </button>
            </div>


            {/* MODAL BODY */}

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Position
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedApplication.position ||
                      "General Application"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedApplication.createdAt
                      ? new Date(
                          selectedApplication.createdAt,
                        ).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>


              {/* PORTFOLIO */}

              {selectedApplication.portfolio && (
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Portfolio / GitHub
                  </p>

                  <a
                    href={
                      selectedApplication.portfolio
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block break-all text-sm text-blue-600 hover:underline"
                  >
                    {selectedApplication.portfolio}
                  </a>
                </div>
              )}


              {/* COVER LETTER */}

              <div>
                <div className="flex items-center gap-2">
                  <FileText
                    size={18}
                    className="text-slate-500"
                  />

                  <h3 className="font-semibold text-slate-900">
                    Cover Letter
                  </h3>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {selectedApplication.coverLetter ||
                      "No cover letter provided."}
                  </p>
                </div>
              </div>


              {/* STATUS */}

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Application Status
                </label>

                <select
                  value={
                    selectedApplication.status ||
                    "New"
                  }
                  disabled={
                    updatingStatusId ===
                    (selectedApplication._id ||
                      selectedApplication.id)
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      selectedApplication,
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>


              {/* NOTES */}

              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare
                    size={18}
                    className="text-slate-500"
                  />

                  <h3 className="font-semibold text-slate-900">
                    Internal Notes
                  </h3>
                </div>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={5}
                  maxLength={5000}
                  placeholder="Add private notes about this applicant..."
                  className="mt-3 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {notes.length}/5000
                  </span>

                  <Button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    {savingNotes
                      ? "Saving..."
                      : "Save Notes"}
                  </Button>
                </div>
              </div>


              {/* FOOTER ACTIONS */}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() =>
                    toggleReadStatus(
                      selectedApplication,
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {selectedApplication.isRead ? (
                    <>
                      <EyeOff size={17} />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <Eye size={17} />
                      Mark Read
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      selectedApplication,
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  <Trash2 size={17} />
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

