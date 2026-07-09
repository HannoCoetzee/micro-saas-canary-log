"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

  if (loading) return <div className="p-20 text-center text-warm-400 animate-pulse">Loading...</div>;
  if (error) return <div className="mx-auto max-w-2xl px-6 py-20 text-center"><p className="text-red-600">{error}</p><Link href="/" className="text-accent hover:underline mt-4 inline-block">← Back to CanaryLog</Link></div>;
  if (!canary) return null;

  const isActive = canary.status === "active";
  const lastSigned = canary.lastSigned ? new Date(canary.lastSigned) : null;
  const daysSince = lastSigned ? Math.floor((Date.now() - lastSigned.getTime()) / 86400000) : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={20} className="text-accent" />
        <span className="text-sm text-warm-500">CanaryLog</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-6 border rounded-lg mb-6 ${isActive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
      >
        <div className="flex items-center gap-2 mb-3">
          {isActive ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
          <h1 className="text-xl font-bold tracking-tight">{canary.name}</h1>
        </div>
        <p className="text-sm text-warm-500 mb-4">{canary.statement}</p>
        <div className="flex gap-4 text-xs text-warm-500">
          <span>Status: <strong className={isActive ? "text-green-600" : "text-red-600"}>{canary.status}</strong></span>
          <span>Frequency: {canary.frequency}</span>
          {lastSigned && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Last signed: {lastSigned.toLocaleDateString()} ({daysSince} days ago)
            </span>
          )}
        </div>
      </motion.div>

      {canary.entries?.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Transparency Log</h2>
          <div className="space-y-2">
            {canary.entries.map((entry: any) => (
              <div key={entry.id} className="p-3 bg-warm-50 border border-warm-200 rounded text-sm">
                <p className="text-warm-600">{entry.message}</p>
                <p className="text-xs text-warm-400 mt-1">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}