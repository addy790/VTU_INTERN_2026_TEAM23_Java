import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, ArrowRight, Building2, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { ApplicationTracker } from "@/components/ApplicationTracker";

const Applications = () => {
  const { user } = useRole();
  const [q, setQ] = useState("");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await api.applications.getByStudent(user!.id);
        setApps(data);
      } catch (error) {
        console.error("Failed to fetch apps", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchApps();
  }, [user]);

  const filtered = apps.filter(a => 
    a.drive?.companyName?.toLowerCase().includes(q.toLowerCase()) || 
    a.drive?.role?.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <div className="h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <DashboardLayout title="My Applications">
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Search applications..." 
            className="pl-9 h-11"
          />
        </div>

        <div className="surface-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/20 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                <th className="px-6 py-4">Company & Role</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(filtered || []).map(a => (
                <tr key={a?.id || Math.random()} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-secondary/50 grid place-items-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{a?.drive?.companyName || "Unknown Company"}</div>
                        <div className="text-xs text-muted-foreground">{a?.drive?.role || "Role"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {a?.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={a?.status || "Applied"} />
                  </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => { setSelectedApp(a); setShowTracker(true); }}
                    className="text-accent text-xs font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    Track Process <ArrowRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ApplicationTracker 
        open={showTracker} 
        onOpenChange={setShowTracker} 
        application={selectedApp} 
      />
    </div>
  </DashboardLayout>
);
};

export default Applications;
