import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
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
      const result = await signup(name, email, password);
      setUser(result.user);
      // A newly created learner should always see the first-run path builder,
      // even when this browser previously held another mock user's choices.
      localStorage.removeItem("axiom_active_course");
      localStorage.removeItem("axiom_course_profiles");
      navigate("/dashboard");
    } catch {
      setError("Couldn't create your account. Try a different email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout switchTo={{ to: "/login", label: "Log in" }}>
        <h1 className="text-center font-display text-[32px] font-extrabold leading-tight tracking-tight">Create your account</h1>
        <p className="muted mt-1 text-center text-[15px] font-semibold">Make a little room for your curiosity.</p>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div>
            <label htmlFor="name" className="text-sm font-extrabold">Name</label>
            <input id="name" autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field mt-2"
              placeholder="Ada Lovelace"
            />
          </div>
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
            <input id="password" autoComplete="new-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field mt-2"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p role="alert" className="rounded-xl bg-coral-soft px-4 py-3 text-sm font-bold text-coral-dark dark:text-coral">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="primary-button mt-2 w-full"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="muted mt-6 text-center text-sm font-semibold">
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold uppercase tracking-wider text-sky-dark dark:text-sky">
            Log in
          </Link>
        </p>
    </AuthLayout>
  );
}
