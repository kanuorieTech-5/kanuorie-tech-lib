import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  RefreshCw,
  Trash2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
} from "../../components/common";

import {
  DashboardHeader,
} from "../../components/dashboard";

import {
  getAdminUsers,
  updateUserRole,
  deleteAdminUser,
} from "../../services";

const ROLES = ["All", "User", "Admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const [error, setError] = useState("");

  const fetchUsers = async ({
    refresh = false,
  } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getAdminUsers();

      /*
       * Support common API response structures:
       *
       * []
       * { data: [] }
       * { data: { users: [] } }
       * { users: [] }
       */

      const data =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.users)
          ? response.data.users
          : Array.isArray(response?.users)
          ? response.users
          : [];

      setUsers(data);
    } catch (err) {
      console.error(
        "Failed to load admin users:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to load users.";

      setError(message);

      if (refresh) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name =
        user.name ||
        user.fullName ||
        "";

      const email =
        user.email ||
        "";

      const userRole =
        user.role ||
        "User";

      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query);

      const matchesRole =
        role === "All" ||
        userRole.toLowerCase() ===
          role.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      setUpdatingRoleId(userId);

      await updateUserRole(
        userId,
        newRole
      );

      setUsers((previous) =>
        previous.map((user) =>
          (user._id || user.id) === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

      toast.success(
        "User role updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update user role:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDelete = async (user) => {
    const userId =
      user._id || user.id;

    const name =
      user.name ||
      user.fullName ||
      user.email ||
      "this user";

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeletingId(userId);

      await deleteAdminUser(userId);

      setUsers((previous) =>
        previous.filter(
          (item) =>
            (item._id || item.id) !==
            userId
        )
      );

      toast.success(
        "User deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete user:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) =>
      String(user.role || "User")
        .toLowerCase() === "admin"
  ).length;

  const regularUserCount =
    totalUsers - adminCount;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <DashboardHeader
        title="User Management"
        subtitle="Manage registered users, roles and account access."
      />

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <Card className="p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalUsers}
              </p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Users size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Administrators
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {adminCount}
              </p>
            </div>

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <ShieldCheck size={24} />
            </div>

          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Regular Users
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {regularUserCount}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <UserRound size={24} />
            </div>

          </div>
        </Card>

      </div>

      {/* =========================
          USERS CARD
      ========================= */}

      <Card className="overflow-hidden">

        {/* Toolbar */}

        <div className="border-b border-slate-200 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Role */}

              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                {ROLES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              {/* Refresh */}

              <Button
                variant="secondary"
                onClick={() =>
                  fetchUsers({
                    refresh: true,
                  })
                }
                disabled={refreshing}
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="ml-2">
                  Refresh
                </span>
              </Button>

            </div>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}

        {filteredUsers.length === 0 ? (

          <div className="px-6 py-20 text-center">

            <Users
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No users found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search or
              role filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  <th className="px-6 py-4">
                    User
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => {

                    const userId =
                      user._id ||
                      user.id;

                    const name =
                      user.name ||
                      user.fullName ||
                      "Unnamed User";

                    const email =
                      user.email ||
                      "No email";

                    const currentRole =
                      user.role ||
                      "User";

                    return (
                      <tr
                        key={userId}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                              {name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="font-semibold text-slate-900">
                              {name}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {email}
                        </td>

                        <td className="px-6 py-5">

                          <select
                            value={
                              currentRole
                            }
                            disabled={
                              updatingRoleId ===
                              userId
                            }
                            onChange={(
                              event
                            ) =>
                              handleRoleChange(
                                userId,
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
                          >
                            <option value="User">
                              User
                            </option>

                            <option value="Admin">
                              Admin
                            </option>
                          </select>

                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                user
                              )
                            }
                            disabled={
                              deletingId ===
                              userId
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2
                              size={16}
                            />

                            {deletingId ===
                            userId
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </Card>

    </div>
  );
}