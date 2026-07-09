import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-warm-200 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">CanaryLog</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-warm-500">
          <Link href="/" className="transition hover:text-ink">Home</Link>
          <Link href="https://hub.uncomfortablebudget.com" className="transition hover:text-ink">Hub</Link>
          <a href="mailto:hello@uncomfortablebudget.com" className="transition hover:text-ink">Contact</a>
          <a href="https://github.com/HannoCoetzee" target="_blank" rel="noopener noreferrer" className="transition hover:text-ink">GitHub</a>
        </nav>

        <p className="text-xs text-warm-400">
          © {new Date().getFullYear()} Uncomfortable Budget. Built fast, priced fair.
        </p>
      </div>
    </footer>
  );
}