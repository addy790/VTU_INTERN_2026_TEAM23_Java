import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { drives, myApplications } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CoordinatorApplications = () => {
  const [q, setQ] = useState("");

  const apps = myApplications.map(a => {
    const d = drives.find(x => x.id === a.driveId)!;
    return { ...a, drive: d };
  });

  const filteredApps = apps.filter(a => 
    a.drive.company.toLowerCase().includes(q.toLowerCase()) || 
    a.drive.role.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <DashboardLayout title="Track Applications">
      <div className="surface-card p-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="font-display text-lg">Platform Applications</div>
            <div className="text-xs text-muted-foreground mt-1">Monitor the status of all student applications</div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company or role..." className="pl-9 w-64 h-9 text-xs" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredApps.map(a => (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-maroon grid place-items-center text-xl font-bold text-white shadow-glow shrink-0 mt-1">
                  {a.drive.company[0]}
                </div>
                <div>
                  <div className="font-semibold text-lg">{a.drive.company}</div>
                  <div className="text-sm font-medium text-foreground/80 mt-0.5">{a.drive.role}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-2">Applied: {new Date(a.appliedOn).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:text-right">
                <div className="hidden sm:block">
                  <div className="text-xs text-muted-foreground">Applicants</div>
                  <div className="font-mono text-sm">{a.drive.applicants} Total</div>
                </div>
                <div className="border-l border-border/50 pl-6 space-y-1">
                  <div className="text-xs text-muted-foreground">My Status</div>
                  <StatusBadge status={a.status} />
                </div>
              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
             <div className="text-center py-16 border border-dashed border-border rounded-xl">
               <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                 <FileText className="h-6 w-6 text-muted-foreground" />
               </div>
               <h3 className="text-base font-semibold text-foreground mb-1">No applications found</h3>
               <p className="text-sm text-muted-foreground">No applications match your search query.</p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorApplications;
