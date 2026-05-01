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

    </DashboardLayout>
  );
};

export default RecruiterDashboard;
