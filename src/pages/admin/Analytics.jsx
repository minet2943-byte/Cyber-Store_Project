import { useMemo, useState } from "react";

const ORDERS_KEY = "cyber-store-orders";

function loadAllOrders() {
  if (typeof window === "undefined") return [];
  try {
    const ordersByCustomer = JSON.parse(
      window.localStorage.getItem(ORDERS_KEY) || "{}",
    );
    return Object.entries(ordersByCustomer).flatMap(([email, orders]) =>
      orders.map((order) => ({
        ...order,
        customer: order.customer || { name: email, email },
        paymentMethod: order.paymentMethod || "Visa ending in 4242",
      })),
    );
  } catch {
    return [];
  }
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function Analytics() {
  const [periodType, setPeriodType] = useState("month");
  const [period, setPeriod] = useState(currentMonth);
  const [reportPeriod, setReportPeriod] = useState(currentMonth);
  const [orders, setOrders] = useState(loadAllOrders);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) return false;
      return periodType === "month"
        ? order.createdAt.slice(0, 7) === reportPeriod
        : String(date.getFullYear()) === reportPeriod;
    });
  }, [orders, periodType, reportPeriod]);

  const soldProducts = useMemo(() => {
    const products = new Map();
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const current = products.get(item.product.id) || {
          id: item.product.id,
          name: item.product.name,
          quantity: 0,
          revenue: 0,
        };
        const unitPrice = item.product.price + (item.variant?.priceDelta ?? 0);
        current.quantity += item.qty;
        current.revenue += unitPrice * item.qty;
        products.set(item.product.id, current);
      });
    });
    return [...products.values()].sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const soldQuantity = soldProducts.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const generateReport = () => {
    setReportPeriod(period);
    setOrders(loadAllOrders());
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
          Analytics
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Insights and performance
        </h1>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          generateReport();
        }}
        className="rounded-3xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
              Sales report
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Products sold and customer payments
            </h2>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm text-gray-300">
              Period
              <select
                value={periodType}
                onChange={(event) => {
                  const type = event.target.value;
                  setPeriodType(type);
                  setPeriod(
                    type === "month"
                      ? currentMonth()
                      : String(new Date().getFullYear()),
                  );
                }}
                className="mt-2 block rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </label>
            <label className="text-sm text-gray-300">
              {periodType === "month" ? "Month" : "Year"}
              <input
                type={periodType === "month" ? "month" : "number"}
                min={periodType === "year" ? "2000" : undefined}
                max={periodType === "year" ? "2100" : undefined}
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="mt-2 block rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-black"
            >
              Generate report
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Products sold", soldQuantity],
          ["Orders", filteredOrders.length],
          ["Paid revenue", `$${revenue.toFixed(2)}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <p className="text-sm text-gray-400">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
            Traffic
          </p>
          <div className="mt-4 h-64 rounded-3xl bg-[#08101f] p-5 text-sm text-gray-400">
            {filteredOrders.length} orders in the selected period.
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
            Revenue
          </p>
          <div className="mt-4 h-64 rounded-3xl bg-[#08101f] p-5">
            <p className="text-3xl font-semibold text-white">
              ${revenue.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-gray-400">Payments collected</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
              Trends
            </p>
            <h2 className="text-xl font-semibold text-white">Product demand</h2>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-void text-gray-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Units sold</th>
                <th className="px-4 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="px-4 py-3 text-white">{product.name}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    ${product.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {soldProducts.length === 0 && (
            <p className="p-6 text-sm text-gray-500">
              No sold products for this period.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
          Payments
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Customers who bought products
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-void text-gray-400">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Order date</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="text-white">{order.customer.name}</p>
                    <p className="text-xs text-gray-500">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <p className="p-6 text-sm text-gray-500">
              No payments for this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
