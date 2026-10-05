import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useStoreSettings } from "../context/StoreSettingsContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/cart", label: "Cart" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { settings } = useStoreSettings();
  const customerLinks = isAdmin
    ? links.filter((link) => link.to !== "/cart")
    : links;

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-violet-soft" : "text-gray-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-void/90 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          to="/"
          className="font-mono text-lg font-bold tracking-wide text-violet-soft"
        >
          {settings.logoName || settings.siteName}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {customerLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="search"
              placeholder="Search…"
              className="w-52 rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-gray-200 placeholder:text-gray-500 focus:border-violet focus:outline-none"
            />
          </label>
          {!isAdmin && (
            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-gray-300 hover:text-white"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-lg border border-violet px-3 py-2 text-sm text-violet-soft hover:text-white"
                >
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-gray-200">
                {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="rounded-lg border border-border px-3 py-2 text-sm text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-violet px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-soft hover:shadow-violet/20"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="p-2 text-gray-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-void px-4 pb-4 pt-2 md:hidden">
          <input
            type="search"
            placeholder="Search…"
            className="mb-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:border-violet focus:outline-none"
          />
          <div className="flex flex-col gap-3">
            {customerLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                onClick={() => setOpen(false)}
                end={l.to === "/"}
              >
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left text-sm font-medium text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
