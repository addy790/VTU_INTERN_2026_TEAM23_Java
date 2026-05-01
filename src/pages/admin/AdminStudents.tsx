import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const AdminStudents = () => {
  const [q, setQ] = useState("");
  const [realStudents, setRealStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentList = await api.students.getAll();
        setRealStudents(studentList);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = (realStudents || []).filter(s =>
    (s?.name || "").toLowerCase().includes(q.toLowerCase()) ||
    (s?.branch || "").toLowerCase().includes(q.toLowerCase()) ||
    (s?.skills && s?.skills.join(" ").toLowerCase().includes(q.toLowerCase()))
  );

  if (loading) {
    return (
      <DashboardLayout title="Student Directory">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Directory">
      <div className="surface-card p-6">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <div className="font-display text-lg">All Registered Students</div>
            <div className="text-xs text-muted-foreground mt-1">Manage profiles, track applications and verification status</div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, branch, skill…" className="pl-9 w-72" />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-3 font-normal min-w-[200px]">Student</th>
                <th className="py-3 font-normal">Branch</th>
                <th className="py-3 font-normal">CGPA</th>
                <th className="py-3 font-normal min-w-[150px]">Skills</th>
                <th className="py-3 font-normal">Applied</th>
                <th className="py-3 font-normal">Status</th>
                <th className="py-3 font-normal text-right">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                    No students match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s?.id || Math.random()} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-maroon grid place-items-center text-xs font-semibold text-primary-foreground">
                          {s?.name ? s.name.split(" ").map((p: any) => p[0]).join("").slice(0, 2) : "??"}
                        </div>
                        <div>
                          <div className="font-medium">{s?.name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{s?.user?.email || "No Email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">{s?.branch || "N/A"}</td>
                    <td className="py-4 font-mono font-medium">{s?.cgpa?.toFixed(1) || "0.0"}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {s?.skills && s?.skills.slice(0, 2).map((k: any) => <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border">{k}</span>)}
                        {s?.skills && s?.skills.length > 2 && <span className="text-[10px] text-muted-foreground font-medium">+{s.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-4 font-mono">{s?.appliedCount || "0"}</td>
                    <td className="py-4"><StatusBadge status={s?.verified ? "Verified" : "Pending"} /></td>
                    <td className="py-4 text-right">
                      {s?.placed
                        ? <span className="text-success text-xs font-semibold">Placed · {s?.packageAmount || "N/A"}</span>
                        : <span className="text-muted-foreground text-xs font-medium">In Process</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
