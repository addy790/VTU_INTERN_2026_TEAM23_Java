import { cn } from "@/lib/utils";

type Status = string;

const STYLES: Record<string, string> = {
  Applied:     "bg-muted text-foreground/80 border-border",
  Shortlisted: "bg-accent/15 text-accent border-accent/30",
  Interview:   "bg-info/15 text-info border-info/30",
  Selected:    "bg-success/15 text-success border-success/30",
  Hired:       "bg-success/15 text-success border-success/30",
  Offer:       "bg-success/15 text-success border-success/30",
  Rejected:    "bg-destructive/15 text-destructive border-destructive/30",
  Pending:     "bg-warning/15 text-warning border-warning/30",
  Verified:    "bg-success/15 text-success border-success/30",
  Open:        "bg-accent/15 text-accent border-accent/30",
  Closed:      "bg-muted text-muted-foreground border-border",
  "Round 1":   "bg-primary/15 text-primary-glow border-primary/30",
  "Round 2":   "bg-primary/15 text-primary-glow border-primary/30",
  HR:          "bg-primary/15 text-primary-glow border-primary/30",
  Sourced:     "bg-muted text-muted-foreground border-border",
  Screened:    "bg-accent/15 text-accent border-accent/30",
  Online:      "bg-info/15 text-info border-info/30",
  Onsite:      "bg-primary/15 text-primary-glow border-primary/30",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const cls = STYLES[status] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
      cls,
      className
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
