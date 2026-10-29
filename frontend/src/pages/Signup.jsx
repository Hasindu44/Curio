import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { errorMessage, fieldErrors } from "../api/client";
import Alert from "../components/common/Alert";
import FormField from "../components/common/FormField";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { validateSignup } from "../lib/validation";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const found = validateSignup(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      const result = await signup(form.name.trim(), form.email.trim(), form.password);
      setUser(result.user);
      // A newly created learner should always see the first-run path builder,
      // even when this browser previously held another user's choices.
      localStorage.removeItem("axiom_active_course");
      localStorage.removeItem("axiom_course_profiles");
      navigate("/dashboard");
    } catch (err) {
      setErrors(fieldErrors(err));
      setError(errorMessage(err, "Couldn't create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout switchTo={{ to: "/login", label: "Log in" }}>
        <h1 className="text-center font-display text-[32px] font-extrabold leading-tight tracking-tight">Create your account</h1>
        <p className="muted mt-1 text-center text-[15px] font-semibold">Make a little room for your curiosity.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-7 grid gap-4">
          <FormField label="Name" error={errors.name}>
            <input id="name" autoComplete="name" value={form.name} onChange={update("name")} maxLength={60} placeholder="Ada Lovelace"/>
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@university.edu"/>
          </FormField>
          <FormField label="Password" error={errors.password} hint="At least 8 characters, with a letter and a number">
            <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={update("password")} maxLength={72} placeholder="At least 8 characters"/>
          </FormField>
          {error && <Alert>{error}</Alert>}
          <button type="submit" disabled={loading} className="primary-button mt-2 w-full">
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
