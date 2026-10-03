import { TrendingUp, DollarSign, Wallet } from "lucide-react";

export default function RevenueSummary({ data = {} }) {
  const revenue = data || {};

  const total =
    revenue.total ??
    revenue.totalRevenue ??
    revenue.revenue ??
    revenue.amount ??
    0;

  const today =
    revenue.today ??
    revenue.todayRevenue ??
    revenue.daily ??
    0;

  const month =
    revenue.month ??
    revenue.monthly ??
    revenue.monthRevenue ??
    0;

  const growth =
    revenue.growth ??
    revenue.growthRate ??
    revenue.percentage ??
    0;

  /*
   * Revenue can be:
   * - a single number
   * - a currency object such as { USD: 1250, NGN: 50000 }
   *
   * Never combine different currencies into one total.
   */
  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return "0";
    }

    if (typeof value === "number") {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }

    if (typeof value === "string") {
      const numericValue = Number(value);

      if (Number.isFinite(numericValue)) {
        return numericValue.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      }

      return value;
    }

    if (typeof value === "object") {
      const entries = Object.entries(value).filter(
        ([, amount]) => Number.isFinite(Number(amount))
      );

      if (!entries.length) {
        return "0";
      }

      return entries
        .map(([currency, amount]) => {
          const formattedAmount = Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          return `${currency} ${formattedAmount}`;
        })
        .join(" • ");
    }

    return "0";
  };

  const formatGrowth = (value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return "0.0%";
    }

    return `${numericValue.toFixed(1)}%`;
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

        <div className="mt-2 flex items-start gap-2">
          <DollarSign
            size={22}
            className="mt-1 shrink-0 text-emerald-600"
          />

          <h3 className="break-words text-3xl font-black text-slate-900">
            {formatCurrency(total)}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Today
            </p>

            <p className="mt-1 break-words text-lg font-bold text-slate-900">
              {formatCurrency(today)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              This Month
            </p>

            <p className="mt-1 break-words text-lg font-bold text-slate-900">
              {formatCurrency(month)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-emerald-500" />

          <span className="font-semibold text-emerald-600">
            {formatGrowth(growth)}
          </span>

          <span className="text-slate-500">growth</span>
        </div>
      </div>
    </section>
  );
}
