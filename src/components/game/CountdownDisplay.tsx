"use client";

export function CountdownDisplay({ value, label }: { value: string | number; label?: string }) {
  return (
    <div className="text-center">
      {label ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </p>
      ) : null}
      <p className="text-5xl font-black tabular-nums text-primary sm:text-6xl">{value}</p>
    </div>
  );
}
