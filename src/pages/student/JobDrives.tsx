import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, MapPin, Briefcase, Calendar, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";
import { Loader2 } from "lucide-react";
import { DriveDetailsDialog } from "@/components/DriveDetailsDialog";

const JobDrives = () => {
  const { user } = useRole();
  const [q, setQ] = useState("");
  const [drives, setDrives] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchData = async () => {
    try {
      const [drivesList, appsList] = await Promise.all([
        api.drives.getAll(),
        api.applications.getByStudent(user!.id)
      ]);
      setDrives(drivesList);
      setApplications(appsList);
    } catch (error) {
      console.error("Failed to fetch drives", error);
      toast.error("Failed to load placement drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleApply = async (driveId: string) => {
    try {
      await api.applications.apply({ studentId: user!.id, driveId });
      toast.success("Applied successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to apply.");
    }
  };

  const filtered = drives.filter(d => 
    d.companyName.toLowerCase().includes(q.toLowerCase()) || 
    d.role.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <div className="h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <DashboardLayout title="Placement Drives">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              placeholder="Search by company or role..." 
              className="pl-9 h-11"
            />
          </div>
          <Button 
            variant="outline" 
            className="h-11"
            onClick={() => toast.info("Advanced filters coming soon!")}
          >
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {(filtered || []).map(d => {
            const hasApplied = (applications || []).some(a => a?.drive?.id === d?.id);
            return (
              <div key={d?.id || Math.random()} className="surface-card p-6 flex flex-col justify-between group hover:border-primary/40 transition-all">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 rounded-xl bg-secondary/50 grid place-items-center text-xl font-bold text-primary">
                        {d?.companyName?.[0] || "?"}
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold">{d?.role || "Role"}</h3>
                        <p className="text-muted-foreground">{d?.companyName || "Organization"}</p>
                      </div>
                    </div>
                    <StatusBadge status={d?.status || "OPEN"} />
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Remote / On-site</div>
                    <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {d?.packageAmount || "N/A"}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Deadline: {d?.deadline || "TBD"}</div>
                    <div className="flex items-center gap-2"><Info className="h-4 w-4" /> Min CGPA: {d?.minCgpa || "0.0"}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => { setSelectedDrive(d); setShowDetails(true); }}
                  >
                    Details
                  </Button>
                  <Button 
                    disabled={hasApplied}
                    onClick={() => handleApply(d.id)}
                    className={`flex-1 ${hasApplied ? "bg-secondary" : "bg-gradient-maroon"}`}
                  >
                    {hasApplied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <DriveDetailsDialog 
          open={showDetails} 
          onOpenChange={setShowDetails} 
          drive={selectedDrive}
          hasApplied={(applications || []).some(a => a?.drive?.id === selectedDrive?.id)}
          onApply={(id) => { handleApply(id); setShowDetails(false); }}
        />
      </div>
    </DashboardLayout>
  );
};

export default JobDrives;
