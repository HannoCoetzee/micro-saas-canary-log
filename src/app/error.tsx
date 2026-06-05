"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-20 text-center">
      <p className="text-red-400 mb-4">Something went wrong</p>
      <button onClick={reset} className="px-4 py-2 bg-[var(--ub-accent)] text-white rounded text-sm">Try again</button>
    </div>
  );
}
