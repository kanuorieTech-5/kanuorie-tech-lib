import { useEffect, useState } from "react";

import {
  DashboardHeader,
  WelcomeBanner,
  StatsGrid,
  LatestBooks,
  LatestCourses,
  LatestOrders,
  LatestUsers,
  RecentActivity,
  QuickActions,
  RevenueSummary,
  SalesOverview,
} from "../components/dashboard";

import { getAdminDashboard } from "../services";

export default function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminDashboard();

        if (!mounted) return;

        /*
         * Support common API response structures:
         *
         * response
         * response.data
         * response.data.data
         */
        const data =
          response?.data?.data ??
          response?.data ??
          response ??
          {};

        setDashboard(data);
      } catch (err) {
        console.error(
          "Failed to load admin dashboard:",
          err
        );

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const stats = dashboard?.stats ?? {};

  const books =
    dashboard?.books ??
    dashboard?.latestBooks ??
    [];

  const courses =
    dashboard?.courses ??
    dashboard?.latestCourses ??
    [];

  const orders =
    dashboard?.orders ??
    dashboard?.latestOrders ??
    [];

  const users =
    dashboard?.users ??
    dashboard?.latestUsers ??
    [];

  const activities =
    dashboard?.activities ??
    dashboard?.recentActivity ??
    [];

  const revenue =
    dashboard?.revenue ??
    {};

  const sales =
    dashboard?.sales ??
    {};

  return (
    <div className="space-y-8">

      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Monitor your platform, content, users and business activity."
      />

      <WelcomeBanner />

      <StatsGrid
        stats={stats}
      />

      <div className="grid gap-8 xl:grid-cols-2">

        <RevenueSummary
          data={revenue}
        />

        <SalesOverview
          data={sales}
        />

      </div>

      <QuickActions />

      <div className="grid gap-8 xl:grid-cols-2">

        <LatestBooks
          books={books}
        />

        <LatestCourses
          courses={courses}
        />

      </div>

      <div className="grid gap-8 xl:grid-cols-2">

        <LatestOrders
          orders={orders}
        />

        <LatestUsers
          users={users}
        />

      </div>

      <RecentActivity
        activities={activities}
      />

    </div>
  );
}