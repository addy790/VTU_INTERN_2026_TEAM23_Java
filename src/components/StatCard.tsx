import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, hint, icon, accent = "primary", className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  accent?: "primary" | "accent" | "success" | "warning";
  className?: string;
}) {
  const accentColor = {
    primary: "text-primary-glow",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
  }[accent];

  return (
    <div className={cn("surface-card p-5 transition-all hover:shadow-elegant", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        {icon && <div className={cn("h-8 w-8 rounded-md bg-secondary grid place-items-center", accentColor)}>{icon}</div>}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
