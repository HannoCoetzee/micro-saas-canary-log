"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Eye, ArrowRight } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetch("/api/auth/me").then(r => r.ok && r.json()).then(d => d?.user && setUser(d.user)).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block rounded-full bg-warm-100 px-4 py-1.5 text-sm font-medium text-warm-600 tracking-wide"
        >
          Cryptographic transparency for your service
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl leading-tight font-semibold tracking-tight md:text-6xl"
        >
          <span className="text-accent">CanaryLog</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-warm-500"
        >
          Publish a cryptographically signed warrant canary and transparency log for your service.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {user ? (
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-medium text-white transition hover:bg-accent-light"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-medium text-white transition hover:bg-accent-light"
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-warm-200 px-7 py-3.5 text-sm font-medium transition hover:bg-warm-50"
              >
                Log in
              </Link>
            </>
          )}
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-20"
        aria-label="Features"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck size={24} />, title: "Warrant canary", desc: "Publish signed statements that prove your service hasn't been compromised" },
            { icon: <FileCheck size={24} />, title: "Transparency log", desc: "Append-only, timestamped entries with cryptographic verification" },
            { icon: <Eye size={24} />, title: "Public verification", desc: "Anyone can verify your canary's signature and freshness" },
          ].map((f, i) => (
            <article key={i} className="p-6 bg-warm-50 border border-warm-200 rounded-lg">
              <div className="text-accent mb-3">{f.icon}</div>
              <h3 className="font-semibold text-base mb-1">{f.title}</h3>
              <p className="text-sm text-warm-500">{f.desc}</p>
            </article>
          ))}
        </div>
      </motion.section>
    </div>
  );
}