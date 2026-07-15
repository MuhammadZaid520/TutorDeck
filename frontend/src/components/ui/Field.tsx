import React from "react";
import { clsx } from "clsx";

export const inputClass =
  "w-full bg-white dark:bg-navy-900 border border-surface-border dark:border-navy-border rounded-btn px-3 py-1.5 text-[13px] text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 placeholder:text-navy-900/30 dark:placeholder:text-white/25 disabled:opacity-50 disabled:cursor-not-allowed";

export const buttonPrimary =
  "bg-accent hover:brightness-110 active:scale-[0.98] text-white font-semibold py-2 px-4 rounded-btn text-[13px] transition-all duration-200 shadow-glow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-accent/30";

export const buttonSecondary =
  "bg-white dark:bg-navy-900 border border-surface-border dark:border-navy-border hover:border-accent/50 text-navy-900 dark:text-white font-semibold py-2 px-4 rounded-btn text-[13px] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent/30";

export const buttonDanger =
  "bg-danger hover:brightness-110 active:scale-[0.98] text-white font-semibold py-2 px-4 rounded-btn text-[13px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-danger/30";

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, error, children, className }: FieldProps) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-navy-900/50 dark:text-white/40">{label}</label>
      {children}
      {error && <span className="text-xs font-medium text-danger mt-0.5">{error}</span>}
    </div>
  );
}
