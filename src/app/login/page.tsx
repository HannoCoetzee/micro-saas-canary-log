"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.ok) { router.push("/dashboard"); router.refresh(); }
    else { const d = await r.json(); setError(d.error || "Login failed"); }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Log in to CanaryLog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email"
          className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded text-sm focus:outline-none focus:border-accent" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password"
          className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded text-sm focus:outline-none focus:border-accent" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full px-3 py-2 bg-accent text-white rounded hover:bg-accent-light transition-colors text-sm font-medium">
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-warm-500">Don't have an account? <Link href="/signup" className="text-accent hover:underline">Sign up</Link></p>
    </div>
  );
}