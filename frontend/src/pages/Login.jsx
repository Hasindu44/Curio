import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { errorMessage, fieldErrors } from "../api/client";
import Alert from "../components/common/Alert";
import FormField from "../components/common/FormField";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../lib/validation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      const result = await login(form.email.trim(), form.password);
      setUser(result.user);
      // Return to the page that asked for login; instructors start in the Studio.
      navigate(location.state?.from ?? (result.user.role === "instructor" ? "/studio" : "/dashboard"), { replace: true });
    } catch (err) {
      setErrors(fieldErrors(err));
      setError(errorMessage(err, "Couldn't log in. Check your credentials and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout switchTo={{ to: "/signup", label: "Sign up" }}>
        <h1 className="text-center font-display text-[32px] font-extrabold leading-tight tracking-tight">Welcome back</h1>
        <p className="muted mt-1 text-center text-[15px] font-semibold">Your next discovery is waiting for you.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-7 grid gap-4">
          <FormField label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@university.edu"/>
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={update("password")} placeholder="••••••••"/>
          </FormField>
          {error && <Alert>{error}</Alert>}
          <button type="submit" disabled={loading} className="primary-button mt-2 w-full">
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
