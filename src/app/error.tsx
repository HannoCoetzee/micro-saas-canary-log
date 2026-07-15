"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-20 text-center">
      <p className="text-red-600 mb-4">Something went wrong</p>
      <button onClick={reset} className="px-4 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-accent-light transition-colors">Try again</button>
    </div>
  );
}
