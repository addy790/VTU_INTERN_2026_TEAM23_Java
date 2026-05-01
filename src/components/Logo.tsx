import { Sparkles } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dim} relative grid place-items-center rounded-lg bg-gradient-maroon shadow-glow`}>
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="leading-none">
        <div className={`font-display font-semibold ${text} tracking-tight`}>PAT</div>
        {size !== "sm" && <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Placement OS</div>}
      </div>
    </div>
  );
}
