import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getCustomers } from "../../service/customer";

const fallbackCustomers = [
  {
    customerId: 13,
    customerName: "fiineth",
    customerEmail: "fiineth@gmail.com",
    customerTelephone: "+855 12 345 678",
    city: "Phnom Penh",
    country: "Cambodia",
    cartId: 4,
    orders: 0,
  },
  {
    customerId: 12,
    customerName: "fiineth",
    customerEmail: "fiineth12@gmail.com",
    customerTelephone: "+855 12 345 678",
    city: "Phnom Penh",
    country: "Cambodia",
    cartId: null,
    orders: 0,
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data.length > 0 ? data : fallbackCustomers);
    } catch (error) {
      console.warn("Could not load customers from API, using fallback:", error);
      setCustomers(fallbackCustomers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term) ||
      c.country?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
            Customers
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Customer Directory
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            View registered shoppers, contact details, and order activity.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-violet hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or city..."
              className="w-full rounded-2xl border border-border bg-void py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-violet focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={16} className="text-teal-soft" />
            <span>
              Total:{" "}
              <strong className="text-white">{customers.length}</strong>{" "}
              customers
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 size={32} className="animate-spin text-teal-soft" />
            <p className="mt-3 text-sm text-gray-400">Loading customers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto text-gray-600" />
            <p className="mt-3 text-base font-medium text-white">
              No customers found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try adjusting your search criteria"
                : "No customer records exist yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((customer) => (
              <div
                key={customer.customerId || customer.email}
                className="flex flex-col justify-between rounded-3xl border border-border bg-void p-5 transition-colors hover:border-violet-dim/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {customer.name || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: #{customer.customerId}
                      </p>
                    </div>

                    {customer.cartId && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal/30 bg-teal/10 px-2 py-0.5 text-[10px] font-medium text-teal-soft">
                        <ShoppingCart size={10} /> Cart #{customer.cartId}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={13} className="shrink-0 text-gray-500" />
                      <span className="truncate">{customer.email}</span>
                    </div>

                    {customer.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone size={13} className="shrink-0 text-gray-500" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                    )}

                    {(customer.city || customer.country) && (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin size={13} className="shrink-0 text-gray-500" />
                        <span className="truncate">
                          {[customer.city, customer.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-border/60 pt-3 text-xs text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag size={13} className="text-violet-soft" />
                    Orders:{" "}
                    <strong className="text-white">
                      {customer.orders ?? 0}
                    </strong>
                  </span>

                  {customer.postalCode && (
                    <span className="text-[11px] text-gray-500">
                      ZIP: {customer.postalCode}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
