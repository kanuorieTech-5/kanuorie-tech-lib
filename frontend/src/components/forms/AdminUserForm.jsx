export default function AdminUserForm(props) {
  const { Button, ROLES, RefreshCw, Search, fetchUsers, refreshing, role, search, setRole, setSearch, className, onSubmit } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Role */}

              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
              >
                {ROLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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
                  className={refreshing ? "animate-spin" : ""}
                />

                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </div>

    </form>
  );
}
