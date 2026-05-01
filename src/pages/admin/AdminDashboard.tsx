import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, Briefcase, TrendingUp, Award, Plus, Search, Loader2 } from "lucide-react";
import { drives, students, placementTrend, departmentPerf, companyHiring } from "@/lib/mock-data";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const AdminDashboard = () => {
  const [q, setQ] = useState("");
  const [data, setData] = useState<any>(null);
  const [realStudents, setRealStudents] = useState<any[]>([]);
  const [realDrives, setRealDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [stats, studentList, driveList] = await Promise.all([
        api.dashboard.getStats(),
        api.students.getAll(),
        api.drives.getAll()
      ]);
      setData(stats);
      setRealStudents(studentList);
      setRealDrives(driveList);
    } catch (err) {
      console.error("Failed to fetch admin dashboard data", err);
      toast.error("Failed to load live data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const driveData = {
      companyName: formData.get("companyName") as string,
      role: formData.get("role") as string,
      packageAmount: formData.get("packageAmount") + " LPA",
      minCgpa: parseFloat(formData.get("minCgpa") as string),
      eligibilityCriteria: formData.get("eligibilityCriteria") as string,
      deadline: formData.get("deadline") as string,
      description: formData.get("description") as string,
    };

    try {
      await api.drives.create(driveData);
      toast.success("Drive published successfully!");
      fetchData(); // Refresh lists
    } catch (err) {
      console.error("Failed to create drive", err);
      toast.error("Failed to publish drive.");
    }
  };

  const filtered = (realStudents || []).filter(s =>
    (s?.name || "").toLowerCase().includes(q.toLowerCase()) ||
    (s?.branch || "").toLowerCase().includes(q.toLowerCase()) ||
    (s?.skills && s?.skills.join(" ").toLowerCase().includes(q.toLowerCase()))
  );

  if (loading) {
    return (
      <DashboardLayout title="Loading Overview...">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const s = data?.stats || {};

  return (
    <DashboardLayout title="Placement Cell — Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total students" value={s.totalStudents?.toString() || "0"} icon={<Users className="h-4 w-4" />} hint="+0 this month" />
        <StatCard label="Active drives" value={s.activeDrives?.toString() || "0"} icon={<Briefcase className="h-4 w-4" />} accent="accent" hint="Real-time data" />
        <StatCard label="Placement rate" value={s.placementRate || "0%"} icon={<TrendingUp className="h-4 w-4" />} accent="success" hint="Current season" />
        <StatCard label="Highest package" value={s.highestPackage || "0 LPA"} icon={<Award className="h-4 w-4" />} accent="warning" hint="Top offer" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-display text-lg">Offers over time</div>
              <div className="text-xs text-muted-foreground">Cumulative offers by month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={placementTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area dataKey="offers" stroke="hsl(var(--primary-glow))" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="surface-card p-6">
          <div className="font-display text-lg mb-2">Top hiring companies</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={companyHiring} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="company" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="hires" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="font-display text-lg mb-2">Department performance</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentPerf}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="placed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display text-lg">Active drives</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-maroon hover:opacity-90"><Plus className="h-3.5 w-3.5 mr-1.5" />New</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create recruitment drive</DialogTitle>
                  <DialogDescription>Publish a drive to eligible students.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDrive} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Company</Label><Input name="companyName" placeholder="Acme Inc." required /></div>
                    <div className="space-y-1.5"><Label>Role</Label><Input name="role" placeholder="SDE I" required /></div>
                    <div className="space-y-1.5"><Label>Package (LPA)</Label><Input name="packageAmount" type="number" placeholder="18" required /></div>
                    <div className="space-y-1.5"><Label>Min CGPA</Label><Input name="minCgpa" type="number" step="0.1" placeholder="7.5" required /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Eligible branches</Label><Input name="eligibilityCriteria" placeholder="CSE, IT, ECE" /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Deadline</Label><Input name="deadline" type="date" required /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Description</Label><Textarea name="description" rows={3} placeholder="Role responsibilities, process, perks…" /></div>
                  </div>
                  <DialogFooter><Button type="submit" className="bg-gradient-maroon">Publish drive</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {realDrives.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-lg">No active drives</div>
            ) : (
              realDrives.slice(0, 5).map(d => (
                <div key={d.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-secondary/30">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{d.companyName}</div>
                    <div className="text-xs text-muted-foreground truncate">{d.role} · {d.status}</div>
                  </div>
                  <div className="text-[10px] font-mono text-primary-glow">{d.packageAmount}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Students table */}
      <div className="surface-card p-6 mt-6">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <div className="font-display text-lg">Students</div>
            <div className="text-xs text-muted-foreground">Manage profiles, applications & verification</div>
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
                <th className="py-3 font-normal">Student</th>
                <th className="py-3 font-normal">Branch</th>
                <th className="py-3 font-normal">CGPA</th>
                <th className="py-3 font-normal">Skills</th>
                <th className="py-3 font-normal">Applied</th>
                <th className="py-3 font-normal">Status</th>
                <th className="py-3 font-normal text-right">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {(filtered || []).map(s => (
                <tr key={s?.id || Math.random()} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-maroon grid place-items-center text-xs font-semibold text-primary-foreground">{s?.name ? s.name.split(" ").map((p: any) => p[0]).join("") : "??"}</div>
                      <div>
                        <div className="font-medium">{s?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{s?.user?.email || "No Email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{s?.branch || "N/A"}</td>
                  <td className="py-3 font-mono">{s?.cgpa?.toFixed(1) || "0.0"}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {s?.skills && s?.skills.slice(0, 2).map((k: any) => <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-border">{k}</span>)}
                      {s?.skills && s?.skills.length > 2 && <span className="text-[10px] text-muted-foreground">+{s.skills.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-3">{s?.appliedCount || "0"}</td>
                  <td className="py-3"><StatusBadge status={s?.verified ? "Verified" : "Pending"} /></td>
                  <td className="py-3 text-right">
                    {s?.placed
                      ? <span className="text-success text-xs font-medium">Placed · {s?.packageAmount || "N/A"}</span>
                      : <span className="text-muted-foreground text-xs">In process</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
