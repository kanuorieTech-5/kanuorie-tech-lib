import { BarChart3, TrendingUp, ShoppingCart } from "lucide-react";

export default function SalesOverview({ data = {} }) {
  const sales = data || {};

  const total = sales.total ?? sales.totalSales ?? sales.sales ?? 0;

  const today = sales.today ?? sales.todaySales ?? 0;

  const month = sales.month ?? sales.monthly ?? sales.monthSales ?? 0;

  const orders = sales.orders ?? sales.totalOrders ?? 0;

  const growth = sales.growth ?? sales.growthRate ?? sales.percentage ?? 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Sales Overview</h2>

            <p className="text-sm text-slate-500">
              Monitor your sales performance
            </p>
          </div>
        </div>

        <TrendingUp size={22} className="text-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-blue-50 p-5">
          <p className="text-sm font-medium text-blue-600">Total Sales</p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {Number(total || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-600">Orders</p>

          <div className="mt-2 flex items-center gap-2">
            <ShoppingCart size={20} className="text-emerald-600" />

            <p className="text-2xl font-black text-slate-900">
              {Number(orders || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Today</p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {Number(today || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-purple-50 p-5">
          <p className="text-sm font-medium text-purple-600">This Month</p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {Number(month || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm">
        <TrendingUp size={16} className="text-emerald-500" />

        <span className="font-semibold text-emerald-600">
          {Number(growth || 0).toFixed(1)}%
        </span>

        <span className="text-slate-500">sales growth</span>
      </div>
    </section>
  );
}
