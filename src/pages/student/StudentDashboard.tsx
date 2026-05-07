import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Briefcase, FileCheck2, Calendar, Award, Upload, ArrowRight, MapPin, Loader2 } from "lucide-react";
import { drives, myApplications, interviews, studentNotifications as notifications } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/RoleContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ApplicationTracker } from "@/components/ApplicationTracker";
import { ResumeUploadDialog } from "@/components/ResumeUploadDialog";
import { PlacementMeter } from "@/components/PlacementMeter";
import { JobMatchCard } from "@/components/JobMatchCard";
import { SkillGapRadar } from "@/components/SkillGapRadar";

const stages = ["Applied", "Shortlisted", "Interview", "Selected"] as const;

function Tracker({ status }: { status: string }) {
  const idx = stages.findIndex(s => s === status);
  const active = idx === -1 ? (status === "Rejected" ? 1 : 0) : idx;
  return (
    <div className="flex items-center gap-1.5">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div className={`h-1.5 w-8 rounded-full ${i <= active ? "bg-primary-glow" : "bg-secondary"}`} />
        </div>
      ))}
      <span className="ml-2 text-xs text-muted-foreground">{status}</span>
    </div>
  );
}

const StudentDashboard = () => {
  const { user } = useRole();
  const [data, setData] = useState<any>(null);
  const [realDrives, setRealDrives] = useState<any[]>([]);
  const [realApplications, setRealApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showTracker, setShowTracker] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [stats, drivesList, appsList] = await Promise.all([
        api.dashboard.getStats(),
        api.drives.getAll(),
        api.applications.getByStudent(user!.id)
      ]);
      setData(stats);
      setRealDrives(drivesList);
      setRealApplications(appsList);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
      toast.error("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!user?.id) return;
    setRecLoading(true);
    try {
      const recs = await api.matching.getRecommendedDrives(user.id);
      setRecommendations(recs);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
      fetchRecommendations();
    }
  }, [user]);

  const handleApply = async (driveId: string) => {
    try {
      await api.applications.apply({ studentId: user!.id, driveId });
      toast.success("Application submitted!");
      fetchDashboard(); // Refresh data
    } catch (error) {
      console.error("Apply failed:", error);
      toast.error("Failed to submit application.");
    }
  };

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "??";

  if (loading) {
    return (
      <DashboardLayout title="Loading Dashboard...">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const s = data?.stats || {};

  return (
    <DashboardLayout title={`Welcome back, ${user?.name || "Student"}`}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <section className="lg:col-span-1 space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-maroon grid place-items-center text-xl font-semibold text-primary-foreground shadow-glow">{initials}</div>
              <div>
                <div className="font-display text-lg">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{s.branch || "Not Set"} · Student</div>
                <div className="mt-1"><StatusBadge status="Verified" /></div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div><div className="font-display text-xl">{s?.cgpa || "0.0"}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">CGPA</div></div>
              <div><div className="font-display text-xl">{s?.appliedCount || "0"}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Applied</div></div>
              <div><div className="font-display text-xl">{s?.isPlaced ? "1" : "0"}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Offers</div></div>
            </div>
            <div className="mt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "System Design"].map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-md bg-secondary border border-border">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Upload className="h-12 w-12" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-semibold">Resume Intelligence</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {user?.resumeUrl ? "Last updated: " + user.resumeUrl.split("/").pop()?.substring(0, 20) + "..." : "No resume detected"}
                </div>
              </div>
              <ResumeUploadDialog onComplete={() => { fetchDashboard(); fetchRecommendations(); }} />
            </div>
            
            {user?.resumeUrl && (
              <div className="mt-4 rounded-xl border border-border bg-secondary/30 aspect-[8.5/11] overflow-hidden shadow-inner group-hover:border-primary/30 transition-colors">
                <iframe 
                  src={`http://localhost:8080${user.resumeUrl}`} 
                  className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                  title="Resume Preview"
                />
              </div>
            )}
          </div>

          <PlacementMeter />

          {recommendations.length > 0 && (
            <SkillGapRadar data={recommendations[0]} loading={recLoading} />
          )}
        </section>

        {/* Right column */}
        <section className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Applied" value="6" icon={<Briefcase className="h-4 w-4" />} />
            <StatCard label="Shortlisted" value="3" icon={<FileCheck2 className="h-4 w-4" />} accent="accent" />
            <StatCard label="Interviews" value="2" icon={<Calendar className="h-4 w-4" />} accent="warning" />
            <StatCard label="Offers" value="1" icon={<Award className="h-4 w-4" />} accent="success" hint="Ironwood Systems · 26 LPA" />
          </div>

          {/* Applications */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display text-lg">My applications</div>
                <div className="text-xs text-muted-foreground">Live status across active drives</div>
              </div>
              <Link to="/student/applications" className="text-xs text-accent hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {(realApplications || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg bg-secondary/10">
                  No applications yet. Start applying to open drives below!
                </div>
              ) : (
                realApplications.map(a => {
                  const d = a?.drive; 
                  return (
                    <div 
                      key={a?.id || Math.random()} 
                      onClick={() => { setSelectedApp(a); setShowTracker(true); }}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer hover:border-primary/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-md grid place-items-center text-xs font-semibold" style={{ background: `hsl(210 100% 50% / 0.2)`, color: `hsl(210 100% 50%)` }}>{d?.companyName?.[0] || "?"}</div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{d?.companyName || "Unknown Company"}</div>
                          <div className="text-xs text-muted-foreground truncate">{d?.role || "Role"} · {d?.packageAmount || "N/A"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tracker status={a?.status || "Applied"} />
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Recommended Drives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">AI Recommended for You</h2>
                <p className="text-xs text-muted-foreground">Top matches based on your unique profile and skills</p>
              </div>
              <Link to="/student/drives" className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">Explore All</Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {recLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-48 rounded-xl border border-border/40 bg-secondary/20 animate-pulse" />
                ))
              ) : recommendations.length > 0 ? (
                recommendations.slice(0, 2).map(rec => (
                  <JobMatchCard key={rec.driveId} match={rec} onApply={handleApply} />
                ))
              ) : (
                <div className="col-span-2 p-8 text-center border border-dashed border-border rounded-xl bg-secondary/10">
                  <p className="text-sm text-muted-foreground italic">No recommendations found. Complete your profile or upload a resume to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Standard Drives */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display text-lg">All recruitment drives</div>
                <div className="text-xs text-muted-foreground">Eligible based on your CGPA & branch</div>
              </div>
              <Link to="/student/drives" className="text-xs text-accent hover:underline inline-flex items-center gap-1">Browse all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {(realDrives || []).length === 0 ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg bg-secondary/10">
                  No open drives at the moment. Check back later!
                </div>
              ) : (
                realDrives.slice(0, 4).map(d => {
                  const hasApplied = (realApplications || []).some(a => a?.drive?.id === d?.id);
                  return (
                    <div key={d?.id || Math.random()} className="p-4 rounded-lg border border-border bg-gradient-card hover:border-primary/40 transition-colors group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-md grid place-items-center text-sm font-semibold group-hover:scale-110 transition-transform" style={{ background: `hsl(280 100% 50% / 0.2)`, color: `hsl(280 100% 50%)` }}>{d?.companyName?.[0] || "?"}</div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{d?.companyName || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground truncate">{d?.role || "Role"}</div>
                          </div>
                        </div>
                        <StatusBadge status={d?.status || "OPEN"} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{"Remote / On-site"}</span>
                        <span className="font-mono text-foreground font-bold">{d?.packageAmount || "N/A"}</span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={hasApplied}
                        onClick={() => handleApply(d.id)}
                        className={`w-full mt-4 h-8 text-[11px] uppercase tracking-wider font-bold transition-all ${hasApplied ? "bg-secondary" : "bg-primary hover:shadow-glow"}`}
                      >
                        {hasApplied ? "Already Applied" : "Quick Apply"}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming + Notifications */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-6">
              <div className="font-display text-lg mb-4">Upcoming interviews</div>
              <div className="space-y-3">
                {interviews.map(i => (
                  <Link 
                    key={i.id} 
                    to="/student/interviews"
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30 hover:border-warning/40 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium group-hover:text-warning transition-colors">{i.company}</div>
                      <div className="text-xs text-muted-foreground">{i.round} · {new Date(i.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
                    </div>
                    <StatusBadge status={i.mode} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="surface-card p-6">
              <div className="font-display text-lg mb-4">Notifications</div>
              <div className="space-y-3">
                {notifications.slice(0, 4).map(n => (
                  <Link 
                    key={n.id} 
                    to="/student/notifications"
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:border-primary/40 transition-colors group"
                  >
                    <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${n.type === "success" ? "bg-success" : n.type === "warning" ? "bg-warning" : "bg-info"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{n.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{n.body}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <ApplicationTracker 
        open={showTracker} 
        onOpenChange={setShowTracker} 
        application={selectedApp} 
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
