import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  useEffect(() => {
    if (isAuthenticated) {
      const userRole = user?.role ?? user?.userRole ?? user?.roles;
      const isAdminUser =
        userRole &&
        (String(userRole).toLowerCase().includes("admin") ||
          String(userRole).toLowerCase().includes("super admin"));

      if (isAdminUser) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, from, navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result?.success) {
        const userRole =
          result?.user?.role ??
          result?.user?.userRole ??
          user?.role ??
          user?.userRole;
        const isAdminUser =
          userRole &&
          (String(userRole).toLowerCase().includes("admin") ||
            String(userRole).toLowerCase().includes("super admin"));

        if (isAdminUser) {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(
          result?.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      // Catches errors thrown by Axios interceptor
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-md items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-7">
        <div className="mb-6 space-y-1.5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-soft">
            Welcome back
          </p>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Login to your account
          </h1>
          <p className="text-xs text-gray-400">
            Enter your details to continue shopping.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-gray-300">
              Email address
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-violet focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-300">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-violet focus:outline-none"
            />
          </label>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-border bg-surface text-violet focus:ring-violet"
              />
              Remember me
            </label>
            <Link
              to="/"
              className="text-teal-soft hover:text-teal transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-xs text-danger mt-1">{error}</p>}

          <Button
            type="submit"
            size="md"
            disabled={loading}
            className="w-full mt-2 font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="font-medium text-violet-soft hover:text-white transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
