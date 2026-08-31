import { TrendingUp, DollarSign, Wallet } from "lucide-react";

export default function RevenueSummary({ data = {} }) {
  const revenue = data || {};

  const total =
    revenue.total ??
    revenue.totalRevenue ??
    revenue.revenue ??
    revenue.amount ??
    0;

  const today = revenue.today ?? revenue.todayRevenue ?? revenue.daily ?? 0;

  const month = revenue.month ?? revenue.monthly ?? revenue.monthRevenue ?? 0;

  const growth =
    revenue.growth ?? revenue.growthRate ?? revenue.percentage ?? 0;

  const formatCurrency = (value) => {
    const numericValue = Number(value || 0);

    return `?${numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Revenue Summary
              </h2>

              <p className="text-sm text-slate-500">
                Platform revenue overview
              </p>
            </div>
          </div>
        </div>

        <TrendingUp size={22} className="text-emerald-500" />
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-500">Total Revenue</p>

        <div className="mt-2 flex items-center gap-2">
          <DollarSign size={22} className="text-emerald-600" />

          <h3 className="text-3xl font-black text-slate-900">
            {formatCurrency(total)}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Today
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(today)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              This Month
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(month)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-emerald-500" />

          <span className="font-semibold text-emerald-600">
            {Number(growth || 0).toFixed(1)}%
          </span>

          <span className="text-slate-500">growth</span>
        </div>
      </div>
    </section>
  );
}
