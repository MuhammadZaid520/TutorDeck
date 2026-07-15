import { clsx } from "clsx";
import { CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";

interface StatusBadgeProps {
  status: "paid" | "due" | "overdue" | "scheduled" | "completed" | "cancelled" | "rescheduled";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<string, { bg: string; text: string; border: string; Icon: typeof Calendar }> = {
    paid:        { bg: "bg-success/10",  text: "text-success",  border: "border-success/20",  Icon: CheckCircle2 },
    completed:   { bg: "bg-success/10",  text: "text-success",  border: "border-success/20",  Icon: CheckCircle2 },
    due:         { bg: "bg-warning/10",  text: "text-warning",  border: "border-warning/20",  Icon: Clock },
    scheduled:   { bg: "bg-accent/10",   text: "text-accent",   border: "border-accent/20",   Icon: Clock },
    rescheduled: { bg: "bg-violet/10",   text: "text-violet",   border: "border-violet/20",   Icon: Clock },
    overdue:     { bg: "bg-danger/10",   text: "text-danger",   border: "border-danger/20",   Icon: AlertCircle },
    cancelled:   { bg: "bg-danger/10",   text: "text-danger",   border: "border-danger/20",   Icon: AlertCircle },
  };

  const c = configs[status] ?? { bg: "bg-navy-900/5", text: "text-navy-900/60 dark:text-white/40", border: "border-navy-900/10 dark:border-white/10", Icon: Calendar };
  const { bg, text, border, Icon } = c;

  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border",
      bg, text, border, className
    )}>
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
}
