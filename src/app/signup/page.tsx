"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.ok) { router.push("/dashboard"); router.refresh(); }
    else { const d = await r.json(); setError(d.error || "Signup failed"); }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Create your CanaryLog account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email"
          className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded text-sm focus:outline-none focus:border-accent" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password (min 6 chars)" minLength={6}
          className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded text-sm focus:outline-none focus:border-accent" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full px-3 py-2 bg-accent text-white rounded hover:bg-accent-light transition-colors text-sm font-medium">
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm text-warm-500">Already have an account? <Link href="/login" className="text-accent hover:underline">Log in</Link></p>
    </div>
  );
}