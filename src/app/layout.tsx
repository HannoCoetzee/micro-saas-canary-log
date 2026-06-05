import "./globals.css";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "CanaryLog — Transparency log & warrant canary",
  description: "Publish a cryptographically signed warrant canary and transparency log for your service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <nav className="border-b border-[var(--ub-border)] px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck size={20} className="text-[var(--ub-accent)]" />
            CanaryLog
          </Link>
          <div className="flex items-center gap-4 text-sm text-[var(--ub-text-muted)]">
            <Link href="/login" className="hover:text-[var(--ub-text)] transition-colors">Log in</Link>
            <Link href="/signup" className="px-3 py-1.5 bg-[var(--ub-accent)] text-white rounded hover:bg-[var(--ub-accent-hover)] transition-colors">Get started</Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--ub-border)] px-6 py-4 text-center text-xs text-[var(--ub-text-muted)]">
          <Link href="https://hub.uncomfortablebudget.com" className="hover:text-[var(--ub-text)]">← Back to Hub</Link>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
