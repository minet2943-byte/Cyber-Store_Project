const orders = [
  {
    id: "ORD-1023",
    customer: "Maya K.",
    total: "$349.00",
    status: "Processing",
  },
  { id: "ORD-1022", customer: "Leo H.", total: "$149.00", status: "Shipped" },
  { id: "ORD-1021", customer: "Ava S.", total: "$299.00", status: "Delivered" },
];

export default function Orders() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Review recent order activity
        </h1>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent orders</h2>
            <p className="text-sm text-gray-400">
              Track order status and fulfillment.
            </p>
          </div>
          <button className="rounded-2xl border border-violet px-4 py-3 text-sm text-violet-soft hover:bg-violet/10">
            View all orders
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-border bg-void p-4 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-gray-400">{order.id}</p>
                <p className="mt-1 text-base font-semibold text-white">
                  {order.customer}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm sm:mt-0">
                <span className="text-gray-300">{order.total}</span>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-gray-200">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
