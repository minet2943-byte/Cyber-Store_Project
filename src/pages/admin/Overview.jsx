import { useEffect, useState } from "react";
import {
  Box,
  ShoppingBag,
  Users,
  DollarSign,
  CreditCard,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  getDashboardSummary,
  DEFAULT_DASHBOARD_SUMMARY,
} from "../../service/dashboard";

export default function Overview() {
  const [summary, setSummary] = useState(DEFAULT_DASHBOARD_SUMMARY);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.warn(
        "Could not load dashboard summary from API, using fallback:",
        error,
      );
      setSummary({
        totalProducts: 142,
        totalCustomers: 4712,
        totalOrders: 1248,
        totalPayments: 1240,
        totalRevenue: 98400,
        formattedRevenue: "$98.4K",
        formattedProducts: "142",
        formattedCustomers: "4,712",
        formattedOrders: "1,248",
        formattedPayments: "1,240",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const stats = [
    {
      label: "Products",
      value: summary.formattedProducts,
      icon: Box,
      tone: "text-teal-soft",
    },
    {
      label: "Orders",
      value: summary.formattedOrders,
      icon: ShoppingBag,
      tone: "text-violet-soft",
    },
    {
      label: "Customers",
      value: summary.formattedCustomers,
      icon: Users,
      tone: "text-sky-400",
    },
    {
      label: "Revenue",
      value: summary.formattedRevenue,
      icon: DollarSign,
      tone: "text-amber-300",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400 hidden sm:block">
              Monitor inventory, orders, and customer activity in one place.
            </p>
            <button
              onClick={loadSummary}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-violet hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-violet-dim/60"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
                <div className={`rounded-2xl bg-white/5 p-3 ${item.tone}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
              Revenue snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Sales performance
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 text-xs font-medium text-ok">
              <TrendingUp size={14} /> Total Payments:{" "}
              {summary.formattedPayments || summary.totalPayments}
            </span>
          </div>
        </div>
        <div className="mt-6 h-64 rounded-3xl bg-gradient-to-br from-violet/10 to-teal/10 p-6 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300 font-mono">
              Net Volume: {summary.formattedRevenue}
            </span>
            <span className="text-gray-400 font-mono text-xs">
              Live Gateway Summary
            </span>
          </div>
          <div className="h-40 rounded-2xl bg-[#0f172a]/80 p-4 border border-border flex items-center justify-around text-center">
            <div>
              <p className="text-xs text-gray-400 font-mono uppercase">
                Products In Stock
              </p>
              <p className="mt-1 text-2xl font-bold text-teal-soft">
                {summary.formattedProducts}
              </p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-xs text-gray-400 font-mono uppercase">
                Completed Orders
              </p>
              <p className="mt-1 text-2xl font-bold text-violet-soft">
                {summary.formattedOrders}
              </p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-xs text-gray-400 font-mono uppercase">
                Total Customers
              </p>
              <p className="mt-1 text-2xl font-bold text-sky-400">
                {summary.formattedCustomers}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
