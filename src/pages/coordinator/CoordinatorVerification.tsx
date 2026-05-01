import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Check, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const CoordinatorVerification = () => {
  const [realUnverified, setRealUnverified] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnverified = async () => {
    try {
      const unverified = await api.students.getUnverified();
      setRealUnverified(unverified);
    } catch (err) {
      console.error("Failed to fetch unverified students", err);
      toast.error("Failed to load live verification queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverified();
  }, []);

  const handleVerify = async (id: string, name: string, ok: boolean) => {
    if (!ok) {
        toast.error(`Rejection logic for ${name} not yet implemented on backend.`);
        return;
    }
    try {
      await api.students.verify(id);
      toast.success(`${name} has been verified!`);
      fetchUnverified(); // Refresh the list
    } catch (err) {
      console.error("Verification failed", err);
      toast.error("Failed to verify student.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Verification">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Verification">
       <div className="surface-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-display text-lg">Verification Queue</div>
            <div className="text-xs text-muted-foreground mt-1">Review documents and approve student profiles for placements</div>
          </div>
          <div className="bg-warning/20 border border-warning/30 text-warning px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
            </span>
            {realUnverified.length} Pending
          </div>
        </div>

        <div className="space-y-4">
          {realUnverified.map(s => (
            <div key={s.id} className="p-5 rounded-lg border border-border bg-secondary/30 hover:border-primary/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-maroon grid place-items-center text-sm font-semibold text-primary-foreground shadow-glow shrink-0">
                    {s.name ? s.name.split(" ").map((p: any) => p[0]).join("").slice(0, 2) : "??"}
                  </div>
                  <div>
                    <div className="font-medium text-base">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.branch || "N/A"} · {s.cgpa?.toFixed(1) || "0.0"} CGPA · {s.user?.email || "No Email"}</div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.skills && s.skills.map((k: any) => <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border text-foreground/80">{k}</span>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0 md:pl-4 md:border-l border-border/50 shrink-0">
                  <Button variant="outline" className="h-9 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0" onClick={() => handleVerify(s.id, s.name, false)}>
                    <X className="h-4 w-4 mr-1.5" /> Reject
                  </Button>
                  <Button className="h-9 bg-gradient-maroon shrink-0" onClick={() => handleVerify(s.id, s.name, true)}>
                    <Check className="h-4 w-4 mr-1.5" /> Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {realUnverified.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/20 mb-4">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">All caught up!</h3>
              <p className="text-sm text-muted-foreground">There are no student profiles waiting for verification.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorVerification;
