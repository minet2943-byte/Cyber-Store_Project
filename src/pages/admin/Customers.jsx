const customers = [
  { name: "Maya Kim", email: "maya@example.com", orders: 18 },
  { name: "Leo Harper", email: "leo@example.com", orders: 9 },
  { name: "Ava Scott", email: "ava@example.com", orders: 5 },
];

export default function Customers() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
          Customers
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Customer relationships
        </h1>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Top customers</h2>
            <p className="text-sm text-gray-400">
              View engaged shoppers and order frequency.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {customers.map((customer) => (
            <div
              key={customer.email}
              className="rounded-3xl border border-border bg-void p-5"
            >
              <p className="text-sm text-gray-400">{customer.name}</p>
              <p className="mt-2 text-base font-semibold text-white">
                {customer.email}
              </p>
              <p className="mt-4 text-sm text-gray-400">
                Orders: {customer.orders}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
