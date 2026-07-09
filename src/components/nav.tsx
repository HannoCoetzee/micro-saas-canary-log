"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-warm-200/80 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <ShieldCheck size={20} className="text-accent" />
          CanaryLog
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/" className="transition hover:text-accent">Home</Link>
          <Link href="/dashboard" className="transition hover:text-accent">Dashboard</Link>
          <a href="https://hub.uncomfortablebudget.com" className="transition hover:text-accent">Hub</a>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-warm-200 px-6 py-4 md:hidden"
          >
            <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">
              Dashboard
            </Link>
            <a href="https://hub.uncomfortablebudget.com" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">
              Hub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}