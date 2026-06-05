"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  interface CanaryItem { id: string; name: string; slug: string; statement: string; status: string; frequency: string; lastSigned: string | null; createdAt: string }
  interface UserData { id: string; email: string; plan?: string }

  const [user, setUser] = useState<UserData | null>(null);
  const [hubPlan, setHubPlan] = useState<string | null>(null);
  const [canaries, setCanaries] = useState<CanaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [statement, setStatement] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [toast, setToast] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then(async r => {
      fetch('/api/hub-plan').then(r => r.json()).then(d => setHubPlan(d.plan || null)).catch(() => {});
      if (!r.ok) { router.push("/login"); return; }
      const d = await r.json(); setUser(d.user);
      const res = await fetch("/api/canary");
      const f = await res.json();
      setCanaries(f.canaries || []);
    }).catch(() => router.push("/login")).finally(() => setLoading(false));
  }, []);

  async function createCanary(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !statement) return;
    const r = await fetch("/api/canary", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, statement, frequency }),
    });
    const d = await r.json();
    if (r.ok) {
      setCanaries(prev => [d.canary, ...prev]);
      setName(""); setStatement(""); setFrequency("weekly");
      setToast("Canary created!"); setTimeout(() => setToast(""), 2000);
    } else { alert(d.error || "Failed to create canary"); }
  }

  async function signCanary(id: string) {
    const canary = canaries.find(c => c.id === id);
    if (!canary) return;
    const r = await fetch(`/api/canary/${id}/sign`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: canary.statement }),
    });
    if (r.ok) {
      setToast("Canary signed!"); setTimeout(() => setToast(""), 2000);
      const res = await fetch("/api/canary");
      const d = await res.json();
      setCanaries(d.canaries || []);
    }
  }

  async function deleteCanary(id: string) {
    if (!confirm("Delete this canary?")) return;
    await fetch(`/api/canary/${id}`, { method: "DELETE" });
    setCanaries(prev => prev.filter(c => c.id !== id));
  }

  if (loading) return <div className="p-20 text-center text-[var(--ub-text-muted)] animate-pulse">Loading...</div>;

  const fleetPlan = hubPlan && ['FLEET_STARTER','FLEET_PRO','FLEET_ULTIMATE','STARTER','PRO','ULTIMATE'].includes(hubPlan.toUpperCase()) ? hubPlan.toUpperCase().replace('FLEET_', '') : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {toast && <div className="mb-4 px-4 py-2 bg-green-900/40 border border-green-800 rounded text-green-300 text-sm">{toast}</div>}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {fleetPlan && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Fleet Pass {fleetPlan}
            </div>
          )}
          <span className="text-sm text-[var(--ub-text-muted)]">{user?.plan || "free"} plan</span>
        </div>
      </div>

      <form onSubmit={createCanary} className="mb-10 p-4 bg-[var(--ub-surface-raised)] border border-[var(--ub-border)] rounded space-y-4">
        <h2 className="font-semibold">New Canary</h2>
        <div>
          <label className="block text-sm text-[var(--ub-text-muted)] mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="My service canary"
            className="w-full px-3 py-2 bg-[var(--ub-surface)] border border-[var(--ub-border)] rounded text-sm" />
        </div>
        <div>
          <label className="block text-sm text-[var(--ub-text-muted)] mb-1">Statement</label>
          <textarea value={statement} onChange={e => setStatement(e.target.value)} required rows={3} placeholder="As of [date], I have not received any..."
            className="w-full px-3 py-2 bg-[var(--ub-surface)] border border-[var(--ub-border)] rounded text-sm" />
        </div>
        <div>
          <label className="block text-sm text-[var(--ub-text-muted)] mb-1">Frequency</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--ub-surface)] border border-[var(--ub-border)] rounded text-sm">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-[var(--ub-accent)] text-white rounded hover:bg-[var(--ub-accent-hover)] transition-colors text-sm">Create canary</button>
      </form>

      {canaries.length === 0 ? (
        <p className="text-[var(--ub-text-muted)]">No canaries yet. Create one above.</p>
      ) : (
        <div className="space-y-3">
          {canaries.map(c => (
            <div key={c.id} className="p-4 bg-[var(--ub-surface-raised)] border border-[var(--ub-border)] rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-[var(--ub-text-muted)] mt-1 line-clamp-2">{c.statement}</p>
                  <div className="flex gap-3 mt-2 text-xs text-[var(--ub-text-muted)]">
                    <span className={`px-2 py-0.5 rounded ${c.status === "active" ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>{c.status}</span>
                    <span>{c.frequency}</span>
                    {c.lastSigned && <span>Last signed: {new Date(c.lastSigned).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/c/${c.slug}`} className="text-xs px-2 py-1 border border-[var(--ub-border)] rounded hover:border-[var(--ub-text-muted)] transition-colors">View</Link>
                  <button onClick={() => signCanary(c.id)} className="text-xs px-2 py-1 bg-[var(--ub-accent)] text-white rounded hover:bg-[var(--ub-accent-hover)] transition-colors">Sign</button>
                  <button onClick={() => deleteCanary(c.id)} className="text-xs px-2 py-1 bg-red-900/40 text-red-300 rounded hover:bg-red-900/60 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
