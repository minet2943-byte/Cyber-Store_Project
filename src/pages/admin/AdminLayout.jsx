import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Box,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/inventory", label: "Inventory", icon: Box },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition-colors ${
    isActive
      ? "bg-violet/10 text-white"
      : "text-gray-400 hover:bg-white/5 hover:text-white"
  }`;

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="min-h-screen lg:pl-[280px]">
        <aside className="border-r border-border bg-card/90 px-5 py-6 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-[280px] lg:overflow-y-auto">
          <div className="mb-10 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-teal-soft">
                Nexus Admin
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Super User
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={itemClass}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-border bg-void/80 p-4 text-sm text-gray-400">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Admin panel
            </p>
            <p className="mt-3 leading-relaxed text-gray-400">
              Manage your storefront, orders, and product inventory from a
              single dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-teal bg-teal/10 px-4 py-3 text-sm text-teal-soft hover:border-teal-soft"
            >
              <ArrowLeft size={16} /> View Storefront
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-2xl border border-border bg-void/90 px-4 py-3 text-sm text-gray-300 hover:border-danger hover:text-danger"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <div className="flex flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-void/90 px-4 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="search"
                  placeholder="Search inventory..."
                  className="w-full rounded-3xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:border-violet focus:outline-none"
                />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
