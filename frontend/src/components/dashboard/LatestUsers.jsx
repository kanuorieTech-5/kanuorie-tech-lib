import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

export default function LatestUsers({ users = [] }) {
  const latestUsers = Array.isArray(users) ? users.slice(0, 5) : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Latest Users</h2>

            <p className="text-sm text-slate-500">Recently registered users</p>
          </div>
        </div>

        <Link
          to="/admin/users"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Empty State */}
      {latestUsers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <Users className="mx-auto mb-3 text-slate-400" size={32} />

          <p className="font-medium text-slate-700">No users yet</p>

          <p className="mt-1 text-sm text-slate-500">
            Newly registered users will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {latestUsers.map((user, index) => {
            const id = user._id || user.id || index;

            const name =
              user.name ||
              user.fullName ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Unknown User";

            const email = user.email || "No email available";

            const role = user.role || "user";

            const avatar =
              user.avatar || user.profileImage || user.image || null;

            return (
              <div
                key={id}
                className="flex items-center justify-between gap-4 py-4"
              >
                {/* User */}
                <div className="flex min-w-0 items-center gap-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {name}
                    </p>

                    <p className="truncate text-sm text-slate-500">{email}</p>
                  </div>
                </div>

                {/* Role */}
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    String(role).toLowerCase() === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {String(role).charAt(0).toUpperCase() + String(role).slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
