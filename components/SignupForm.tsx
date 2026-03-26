"use client";
import React, { useState } from "react";
import "./SignupForm.css";

type Props = {
  onSubmit?: (values: { name: string; email: string; password: string }) => Promise<void> | void;
  loading?: boolean;
};

export default function SignupForm({ onSubmit, loading = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setTouched({ name: true, email: true, password: true, confirm: true });
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await onSubmit?.({ name, email, password });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <div className="sf-card">
      <h2 className="sf-title">Create your account</h2>
      <p className="sf-sub">Start building with Aspire Studio — free trial included.</p>

      <form className="sf-form" onSubmit={handleSubmit} noValidate>
        <label className="sf-field">
          <span className="sf-label">Full name</span>
          <input
            className={`sf-input${touched.name && !name ? " sf-input--error" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            required
            autoComplete="name"
          />
        </label>

        <label className="sf-field">
          <span className="sf-label">Email</span>
          <input
            className={`sf-input${touched.email && !email ? " sf-input--error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            type="email"
            required
            autoComplete="email"
          />
        </label>

        <label className="sf-field">
          <div className="sf-field-row">
            <span className="sf-label">Password</span>
          </div>
          <input
            className={`sf-input${touched.password && !password ? " sf-input--error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            type="password"
            required
            autoComplete="new-password"
          />
        </label>

        <label className="sf-field">
          <span className="sf-label">Confirm password</span>
          <input
            className={`sf-input${touched.confirm && confirm !== password ? " sf-input--error" : ""}`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            type="password"
            required
            autoComplete="new-password"
          />
        </label>

        {error && <div className="sf-error" role="alert">{error}</div>}

        <button className="sf-submit" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="sf-footer">Already have an account? <a href="/login">Sign in</a></p>
    </div>
  );
}
