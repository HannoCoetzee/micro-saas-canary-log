"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle, XCircle, Clock } from "lucide-react";

export default function CanaryView({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [canary, setCanary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(p => {
      setSlug(p.slug);
      fetch(`/api/canary/${p.slug}/verify`)
        .then(r => r.json())
        .then(d => {
          if (d.error) setError(d.error);
          else setCanary(d.canary);
        })
        .catch(() => setError("Failed to load canary"))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <div className="p-20 text-center text-[var(--ub-text-muted)] animate-pulse">Loading...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-6 py-20 text-center"><p className="text-red-400">{error}</p><Link href="/" className="text-[var(--ub-accent)] hover:underline mt-4 inline-block">← Back to CanaryLog</Link></div>;
  if (!canary) return null;

  const isActive = canary.status === "active";
  const lastSigned = canary.lastSigned ? new Date(canary.lastSigned) : null;
  const daysSince = lastSigned ? Math.floor((Date.now() - lastSigned.getTime()) / 86400000) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={20} className="text-[var(--ub-accent)]" />
        <span className="text-sm text-[var(--ub-text-muted)]">CanaryLog</span>
      </div>

      <div className={`p-6 border rounded mb-6 ${isActive ? "bg-green-900/10 border-green-800" : "bg-red-900/10 border-red-800"}`}>
        <div className="flex items-center gap-2 mb-3">
          {isActive ? <CheckCircle size={20} className="text-green-400" /> : <XCircle size={20} className="text-red-400" />}
          <h1 className="text-xl font-bold">{canary.name}</h1>
        </div>
        <p className="text-sm text-[var(--ub-text-muted)] mb-4">{canary.statement}</p>
        <div className="flex gap-4 text-xs text-[var(--ub-text-muted)]">
          <span>Status: <strong className={isActive ? "text-green-400" : "text-red-400"}>{canary.status}</strong></span>
          <span>Frequency: {canary.frequency}</span>
          {lastSigned && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Last signed: {lastSigned.toLocaleDateString()} ({daysSince} days ago)
            </span>
          )}
        </div>
      </div>

      {canary.entries?.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Transparency Log</h2>
          <div className="space-y-2">
            {canary.entries.map((entry: any) => (
              <div key={entry.id} className="p-3 bg-[var(--ub-surface-raised)] border border-[var(--ub-border)] rounded text-sm">
                <p className="text-[var(--ub-text-muted)]">{entry.message}</p>
                <p className="text-xs text-[var(--ub-text-muted)] mt-1">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-10 pt-4 border-t border-[var(--ub-border)] text-center text-xs text-[var(--ub-text-muted)]">
        <Link href="https://canarylog.uncomfortablebudget.com" className="text-[var(--ub-accent)] hover:underline">Powered by CanaryLog</Link>
        {" · "}
        <Link href="https://hub.uncomfortablebudget.com" className="hover:text-[var(--ub-text)]">Hub</Link>
      </footer>
    </div>
  );
}
