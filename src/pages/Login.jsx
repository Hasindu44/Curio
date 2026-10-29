import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      setUser(result.user);
      navigate("/dashboard");
    } catch {
      setError("Couldn't log in. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout switchTo={{ to: "/signup", label: "Sign up" }}>
        <h1 className="text-center font-display text-[32px] font-extrabold leading-tight tracking-tight">Welcome back</h1>
        <p className="muted mt-1 text-center text-[15px] font-semibold">Your next discovery is waiting for you.</p>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-extrabold">Email</label>
            <input id="email" autoComplete="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field mt-2"
              placeholder="you@university.edu"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-extrabold">Password</label>
            <input id="password" autoComplete="current-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field mt-2"
              placeholder="••••••••"
            />
          </div>
          {error && <p role="alert" className="rounded-xl bg-coral-soft px-4 py-3 text-sm font-bold text-coral-dark dark:text-coral">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="primary-button mt-2 w-full"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="muted mt-6 text-center text-sm font-semibold">
          New here?{" "}
          <Link to="/signup" className="font-extrabold uppercase tracking-wider text-sky-dark dark:text-sky">
            Create an account
          </Link>
        </p>
    </AuthLayout>
  );
}
