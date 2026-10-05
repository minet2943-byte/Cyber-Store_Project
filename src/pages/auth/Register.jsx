import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register({ name, email, password });

      // Handles AuthContext implementations returning boolean/object or void on success
      if (result === undefined || result?.success || result) {
        navigate(from, { replace: true });
      } else {
        setError(result?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      // Catches error messages thrown by Axios interceptor
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-md items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-7">
        <div className="mb-6 space-y-1.5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-soft">
            Create account
          </p>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Register for Cyber Store
          </h1>
          <p className="text-xs text-gray-400">
            Start shopping faster by creating an account with us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-gray-300">Full name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-teal focus:outline-none"
            />
          </label>

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
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-teal focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-300">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-teal focus:outline-none"
            />
          </label>

          {error && <p className="text-xs text-danger mt-1">{error}</p>}

          <Button
            type="submit"
            size="md"
            disabled={loading}
            className="w-full mt-2 font-medium"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-violet-soft hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}