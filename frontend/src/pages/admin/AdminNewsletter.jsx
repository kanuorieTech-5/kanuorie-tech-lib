import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  Search,
  RefreshCw,
  Trash2,
  Users,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card, Button, Loader } from "../../components/common";

import {
  getSubscribers,
  deleteSubscriber,
} from "../../services/newsletter.service";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* ==========================================
     LOAD SUBSCRIBERS
  ========================================== */

  const loadSubscribers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getSubscribers();

      /*
       * Support common ApiResponse structures:
       *
       * response
       * response.data
       * response.data.data
       */

      const data = response?.data?.data ?? response?.data ?? response ?? [];

      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load newsletter subscribers:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load newsletter subscribers.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  /* ==========================================
     DELETE SUBSCRIBER
  ========================================== */

  const handleDelete = async (subscriber) => {
    const id = subscriber?._id || subscriber?.id;

    if (!id) {
      toast.error("Subscriber ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${subscriber.email} from the newsletter?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);

      await deleteSubscriber(id);

      setSubscribers((current) =>
        current.filter((item) => (item?._id || item?.id) !== id),
      );

      toast.success("Subscriber removed successfully.");
    } catch (err) {
      console.error("Failed to delete subscriber:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete subscriber.",
      );
    } finally {
      setDeleting(null);
    }
  };

  /* ==========================================
     FILTER
  ========================================== */

  const filteredSubscribers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return subscribers;
    }

    return subscribers.filter((subscriber) =>
      String(subscriber?.email || "")
        .toLowerCase()
        .includes(query),
    );
  }, [subscribers, search]);

  /* ==========================================
     STATS
  ========================================== */

  const totalSubscribers = subscribers.length;

  const latestSubscriber = subscribers.length > 0 ? subscribers[0] : null;

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader />

          <p className="mt-4 text-sm text-slate-500">
            Loading newsletter subscribers...
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
          <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your newsletter subscribers.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-0.5 text-red-600" size={24} />

            <div>
              <h2 className="font-semibold text-red-700">
                Unable to load subscribers
              </h2>

              <p className="mt-1 text-sm text-red-600">{error}</p>

              <Button
                type="button"
                onClick={() => loadSubscribers()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Mail size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>

              <p className="text-sm text-slate-500">
                Manage your newsletter subscribers.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => loadSubscribers(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Subscribers
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalSubscribers}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Subscribers
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalSubscribers}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Latest Subscriber
              </p>

              <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                {latestSubscriber?.email || "No subscribers yet"}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </Card>
      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subscribers..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </Card>

      {/* ==========================================
          TABLE
      ========================================== */}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">Subscribers</h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredSubscribers.length} subscriber
                {filteredSubscribers.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {filteredSubscribers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Mail size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              {search ? "No subscribers found" : "No subscribers yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try adjusting your search."
                : "Newsletter subscribers will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subscribed
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredSubscribers.map((subscriber) => {
                  const id = subscriber?._id || subscriber?.id;

                  return (
                    <tr key={id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Mail size={17} />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {subscriber?.email || "�"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {subscriber?.createdAt
                          ? new Date(subscriber.createdAt).toLocaleDateString()
                          : "�"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(subscriber)}
                          disabled={deleting === id}
                          className="inline-flex items-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove subscriber"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
