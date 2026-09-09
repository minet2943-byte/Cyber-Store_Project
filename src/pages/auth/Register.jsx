import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = register({ name, email, password });

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/10">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-soft">
            Create account
          </p>
          <h1 className="text-3xl font-bold text-white">
            Register for Cyber Store
          </h1>
          <p className="text-sm text-gray-400">
            Start shopping faster by creating an account with us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-200">Full name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-teal focus:outline-none"
            />
          </label>

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
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-teal focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-200">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-teal focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-danger mt-1">{error}</p>}

          <Button type="submit" size="lg" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-soft hover:text-violet">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
