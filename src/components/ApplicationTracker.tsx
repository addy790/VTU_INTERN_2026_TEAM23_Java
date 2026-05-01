import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Clock, CircleDot, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description: string;
  status: "complete" | "current" | "pending" | "error";
  date?: string;
}

const steps: Record<string, Step[]> = {
  "Applied": [
    { label: "Application Submitted", description: "Successfully received by recruiter", status: "complete", date: "Jan 12, 2024" },
    { label: "Initial Screening", description: "Waiting for resume review", status: "current" },
    { label: "Technical Round", description: "To be scheduled", status: "pending" },
    { label: "HR Round", description: "Final discussion", status: "pending" },
  ],
  "Shortlisted": [
    { label: "Application Submitted", description: "Successfully received by recruiter", status: "complete", date: "Jan 10, 2024" },
    { label: "Initial Screening", description: "Resume approved", status: "complete", date: "Jan 15, 2024" },
    { label: "Technical Assessment", description: "Online coding round", status: "current" },
    { label: "Technical Round", description: "In-person / Virtual interview", status: "pending" },
  ],
  "Interview": [
    { label: "Resume Screening", description: "Approved", status: "complete", date: "Jan 05, 2024" },
    { label: "Technical Assessment", description: "Passed", status: "complete", date: "Jan 12, 2024" },
    { label: "Technical Round 1", description: "Completed successfully", status: "complete", date: "Jan 18, 2024" },
    { label: "Technical Round 2", description: "Interview scheduled for today", status: "current" },
  ],
  "Selected": [
    { label: "Interview Rounds", description: "All rounds completed", status: "complete", date: "Jan 20, 2024" },
    { label: "HR discussion", description: "Salary & package finalized", status: "complete", date: "Jan 22, 2024" },
    { label: "Offer Letter", description: "Released to student", status: "complete", date: "Jan 25, 2024" },
    { label: "Final Selection", description: "Placement confirmed!", status: "complete", date: "Jan 25, 2024" },
  ],
  "Rejected": [
    { label: "Application Submitted", description: "Received", status: "complete" },
    { label: "Initial Assessment", description: "Did not meet criteria", status: "error", date: "Jan 15, 2024" },
    { label: "Process Ended", description: "Try for next drive", status: "pending" },
  ]
};

export function ApplicationTracker({ 
  open, 
  onOpenChange, 
  application 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  application: any;
}) {
  if (!application) return null;

  const currentStatus = application.status || "Applied";
  const timeline = steps[currentStatus] || steps["Applied"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md surface-card border-border/40">
        <DialogHeader>
          <div className="h-12 w-12 rounded-xl bg-primary/20 grid place-items-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-display">Tracking Application</DialogTitle>
          <DialogDescription>
            Live status for {application.drive?.companyName} · {application.drive?.role}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {timeline.map((step, idx) => (
            <div key={idx} className="relative flex gap-4">
              {idx !== timeline.length - 1 && (
                <span 
                  className={cn(
                    "absolute left-[11px] top-6 h-full w-[2px]",
                    step.status === "complete" ? "bg-primary" : "bg-border"
                  )} 
                />
              )}
              
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                {step.status === "complete" ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : step.status === "current" ? (
                  <CircleDot className="h-6 w-6 text-accent animate-pulse" />
                ) : step.status === "error" ? (
                  <AlertCircle className="h-6 w-6 text-destructive" />
                ) : (
                  <Clock className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    "text-sm font-medium",
                    step.status === "pending" && "text-muted-foreground"
                  )}>
                    {step.label}
                  </h4>
                  {step.date && <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{step.date}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
