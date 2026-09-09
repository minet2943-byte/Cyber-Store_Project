import { Box, ShoppingBag, Users, DollarSign } from "lucide-react";

const stats = [
  { label: "Products", value: "142", icon: Box, tone: "text-teal-soft" },
  {
    label: "Orders",
    value: "1,248",
    icon: ShoppingBag,
    tone: "text-violet-soft",
  },
  { label: "Customers", value: "4,712", icon: Users, tone: "text-sky-400" },
  {
    label: "Revenue",
    value: "$98.4K",
    icon: DollarSign,
    tone: "text-amber-300",
  },
];

export default function Overview() {
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
          <p className="text-sm text-gray-400">
            Monitor inventory, orders, and customer activity in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-card p-6"
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
          <button className="rounded-2xl border border-violet px-4 py-2 text-sm text-violet-soft hover:bg-violet/10">
            Export report
          </button>
        </div>
        <div className="mt-6 h-64 rounded-3xl bg-gradient-to-br from-violet/10 to-teal/10 p-6 text-white">
          <p className="text-sm text-gray-400">Chart placeholder</p>
          <div className="mt-6 h-full rounded-3xl bg-[#0f172a]/80 p-4">
            <div className="h-full rounded-3xl border border-dashed border-border bg-[#08101f]" />
          </div>
        </div>
      </div>
    </div>
  );
}
