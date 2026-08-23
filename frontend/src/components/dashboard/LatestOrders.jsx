import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

export default function LatestOrders({ orders = [] }) {
  const latestOrders = Array.isArray(orders)
    ? orders.slice(0, 5)
    : [];

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (
      normalized === "paid" ||
      normalized === "completed" ||
      normalized === "success" ||
      normalized === "successful"
    ) {
      return {
        className:
          "bg-emerald-50 text-emerald-600",
        icon: CheckCircle2,
      };
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled" ||
      normalized === "failed"
    ) {
      return {
        className:
          "bg-red-50 text-red-600",
        icon: XCircle,
      };
    }

    return {
      className:
        "bg-amber-50 text-amber-600",
      icon: Clock3,
    };
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShoppingBag size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Latest Orders
            </h2>

            <p className="text-sm text-slate-500">
              Recent customer orders
            </p>
          </div>
        </div>

        <Link
          to="/admin/orders"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {latestOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <ShoppingBag
            className="mx-auto mb-3 text-slate-400"
            size={32}
          />

          <p className="font-medium text-slate-700">
            No orders yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {latestOrders.map((order, index) => {
            const id =
              order._id ||
              order.id ||
              order.orderId ||
              index;

            const customer =
              order.user?.name ||
              order.user?.email ||
              order.customer?.name ||
              order.customer?.email ||
              order.customerName ||
              order.email ||
              "Customer";

            const amount =
              order.amount ??
              order.total ??
              order.totalAmount ??
              0;

            const status =
              order.status ||
              order.paymentStatus ||
              "Pending";

            const {
              className,
              icon: StatusIcon,
            } = getStatusStyle(status);

            return (
              <div
                key={id}
                className="flex items-center gap-4 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                  {String(customer)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {customer}
                  </p>

                  <p className="text-sm text-slate-500">
                    ?{Number(amount || 0).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${className}`}
                >
                  <StatusIcon size={13} />

                  {String(status)
                    .charAt(0)
                    .toUpperCase() +
                    String(status).slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
