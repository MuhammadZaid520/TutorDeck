import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "success" | "warning" | "accent" | "violet" | "danger" | "navy";
  trend?: { value: number; label: string };
  className?: string;
}

const ACCENT: Record<string, { bg: string; icon: string; border: string }> = {
  success: { bg: "bg-success/10", icon: "text-success", border: "border-success/20" },
  warning: { bg: "bg-warning/10", icon: "text-warning", border: "border-warning/20" },
  accent:  { bg: "bg-accent/10",  icon: "text-accent",  border: "border-accent/20"  },
  violet:  { bg: "bg-violet/10",  icon: "text-violet",  border: "border-violet/20"  },
  danger:  { bg: "bg-danger/10",  icon: "text-danger",  border: "border-danger/20"  },
  navy:    { bg: "bg-navy-900/5 dark:bg-white/5", icon: "text-navy-900 dark:text-white", border: "border-navy-900/10 dark:border-white/10" },
};

// Counter component for animated numbers
function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 800; // Animation duration in ms
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function StatCard({ title, value, icon: Icon, accent = "accent", trend, className }: StatCardProps) {
  const a = ACCENT[accent] || ACCENT["accent"] || { bg: "bg-accent/10", icon: "text-accent", border: "border-accent/20" };
  
  // Extract numeric value for counter
  const numericValue = typeof value === 'string' 
    ? parseInt(value.replace(/[^0-9]/g, '')) 
    : value;
  
  // Check if value is numeric for counter animation
  const isNumeric = typeof value === 'number' || /^\d+$/.test(String(value).replace(/[^0-9]/g, ''));
  const displayValue = isNumeric && typeof value === 'number' ? <Counter value={value} /> : value;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={clsx(
        "surface-card p-6 flex flex-col gap-4 cursor-default select-none",
        "transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", a.bg, a.icon)}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {trend && (
          <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full border", 
            trend.value >= 0 
              ? "bg-success/10 text-success border-success/20" 
              : "bg-danger/10 text-danger border-danger/20"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{title}</p>
        <p className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight leading-none font-mono">
          {displayValue}
        </p>
      </div>
    </motion.div>
  );
}
