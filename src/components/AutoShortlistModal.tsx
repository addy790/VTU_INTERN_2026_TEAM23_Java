import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CheckCircle2, XCircle, Users } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ShortlistResult {
  total: number;
  shortlisted: number;
  rejected: number;
  driveName: string;
}

export function AutoShortlistModal({ 
  driveId, 
  driveName, 
  open, 
  onOpenChange, 
  onComplete 
}: { 
  driveId: string; 
  driveName: string; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortlistResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      const data = await api.drives.autoShortlist(driveId);
      setResult(data);
      toast.success("AI Auto-Shortlisting complete!");
      if (onComplete) onComplete();
    } catch (error: any) {
      toast.error(error.message || "Failed to run shortlisting");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if (!val) reset(); }}>
      <DialogContent className="sm:max-w-[450px] bg-background/95 backdrop-blur-xl border-border/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Auto-Shortlisting
          </DialogTitle>
          <DialogDescription>
            Run the AI engine to evaluate all applicants for <strong>{driveName}</strong> against drive criteria.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Matching Criteria</h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Minimum CGPA compliance
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Skill overlap (min. 50% match)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Department / Branch eligibility
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Aptitude score threshold
                </li>
              </ul>
            </div>
            <p className="text-[10px] text-muted-foreground text-center italic">
              Candidates will be automatically notified via real-time WebSocket events.
            </p>
          </div>
        ) : (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-center space-y-1">
                <Users className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-xl font-display font-bold">{result.total}</div>
                <div className="text-[9px] uppercase font-bold text-muted-foreground">Applied</div>
              </div>
              <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-center space-y-1">
                <CheckCircle2 className="h-4 w-4 mx-auto text-success" />
                <div className="text-xl font-display font-bold text-success">{result.shortlisted}</div>
                <div className="text-[9px] uppercase font-bold text-success">Passed</div>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-center space-y-1">
                <XCircle className="h-4 w-4 mx-auto text-destructive" />
                <div className="text-xl font-display font-bold text-destructive">{result.rejected}</div>
                <div className="text-[9px] uppercase font-bold text-destructive">Rejected</div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-success/5 border border-success/10 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-success shrink-0" />
              <p className="text-xs text-success/80 leading-relaxed">
                The engine successfully processed {result.total} candidates. Shortlisted candidates have been moved to the "SHORTLISTED" stage in the pipeline.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <Button className="w-full h-11 bg-primary hover:shadow-glow transition-all" onClick={handleRun} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Candidates...
                </>
              ) : (
                "Execute AI Evaluation"
              )}
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Close Summary
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
