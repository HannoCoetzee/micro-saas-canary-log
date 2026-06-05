"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck, Eye } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetch("/api/auth/me").then(r => r.ok && r.json()).then(d => d?.user && setUser(d.user)).catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <header>
        <h1 className="text-4xl font-bold mb-2">CanaryLog</h1>
        <p className="text-[var(--ub-text-muted)] mb-8">Publish a cryptographically signed warrant canary and transparency log for your service.</p>
      </header>
      <section aria-label="Features">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <ShieldCheck size={20} />, title: "Warrant canary", desc: "Publish signed statements that prove your service hasn't been compromised" },
            { icon: <FileCheck size={20} />, title: "Transparency log", desc: "Append-only, timestamped entries with cryptographic verification" },
            { icon: <Eye size={20} />, title: "Public verification", desc: "Anyone can verify your canary's signature and freshness" },
          ].map((f, i) => (
            <article key={i} className="p-4 bg-[var(--ub-surface-raised)] border border-[var(--ub-border)] rounded">
              <div className="text-[var(--ub-accent)] mb-2">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-[var(--ub-text-muted)]">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section aria-label="Call to action">
        {user ? (
          <Link href="/dashboard" className="text-[var(--ub-accent)] hover:underline">Go to dashboard →</Link>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border border-[var(--ub-border)] rounded hover:border-[var(--ub-text-muted)] transition-colors">Log in</Link>
            <Link href="/signup" className="px-4 py-2 bg-[var(--ub-accent)] text-white rounded hover:bg-[var(--ub-accent-hover)] transition-colors">Get started</Link>
          </div>
        )}
      </section>
    </div>
  );
}
