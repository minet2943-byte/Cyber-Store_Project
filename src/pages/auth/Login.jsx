import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, from, navigate, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login({ email, password });

    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/10">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-soft">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold text-white">
            Login to your account
          </h1>
          <p className="text-sm text-gray-400">
            Enter your details to continue shopping and managing your cart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-200">
              Email address
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-violet focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-200">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-violet focus:outline-none"
            />
          </label>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border bg-surface text-violet focus:ring-violet"
              />
              Remember me
            </label>
            <Link to="/" className="text-teal-soft hover:text-teal">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-danger mt-1">{error}</p>}

          <Button type="submit" size="lg" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="text-violet-soft hover:text-violet"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
