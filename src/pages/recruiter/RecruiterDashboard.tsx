import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, UserCheck, Calendar, Award, Search, Filter, Check, X, Loader2 } from "lucide-react";
import { candidates, pipelineStages, students, interviews, type PipelineStage } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const RecruiterDashboard = () => {
  const [q, setQ] = useState("");
  const [minCgpa, setMinCgpa] = useState(0);
  const [data, setData] = useState<any>(null);
  const [realStudents, setRealStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [stats, studentList] = await Promise.all([
        api.dashboard.getStats(),
        api.students.getAll()
      ]);
      setData(stats);
      setRealStudents(studentList);
    } catch (err) {
      console.error("Failed to fetch recruiter stats", err);
      toast.error("Failed to load candidate database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = realStudents.filter(s =>
    (s.name?.toLowerCase().includes(q.toLowerCase()) || (s.skills && s.skills.join(" ").toLowerCase().includes(q.toLowerCase())))
    && s.cgpa >= minCgpa
  );

  if (loading) {
    return (
      <DashboardLayout title="Recruiter Dashboard">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const s = data?.stats || {};

  return (
    <DashboardLayout title={`Recruiter — ${data?.userName || "Workspace"}`}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active candidates" value={s.totalStudents?.toString() || "0"} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Shortlisted" value="0" icon={<UserCheck className="h-4 w-4" />} accent="accent" />
        <StatCard label="Interviews this week" value="0" icon={<Calendar className="h-4 w-4" />} accent="warning" />
        <StatCard label="Offers extended" value="3" icon={<Award className="h-4 w-4" />} accent="success" />
      </div>

      <div className="surface-card p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg">Candidate Database</h2>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/recruiter/candidates"}>View All</Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 6).map(s => (
            <div key={s.id} className="p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-maroon grid place-items-center text-xs font-bold text-primary-foreground">
                  {s.name?.[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{s.branch} · {s.cgpa} CGPA</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {(s.skills || []).slice(0, 3).map((skill: string) => (
                  <span key={skill} className="text-[8px] bg-background border border-border px-1.5 py-0.5 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
              No candidates found in the database.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
