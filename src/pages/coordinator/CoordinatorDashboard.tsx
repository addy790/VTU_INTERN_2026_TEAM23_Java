import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckSquare, FileText, MessageSquare, Clock, Check, X, Loader2 } from "lucide-react";
import { students, drives, myApplications } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const CoordinatorDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [realUnverified, setRealUnverified] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [stats, unverified] = await Promise.all([
        api.dashboard.getStats(),
        api.students.getUnverified()
      ]);
      setData(stats);
      setRealUnverified(unverified);
    } catch (err) {
      console.error("Failed to fetch coordinator data", err);
      toast.error("Failed to load live verification queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: string, name: string, ok: boolean) => {
    if (!ok) {
        toast.error(`Rejection logic for ${name} not yet implemented on backend.`);
        return;
    }
    try {
      await api.students.verify(id);
      toast.success(`${name} has been verified!`);
      fetchData(); // Refresh the list
    } catch (err) {
      console.error("Verification failed", err);
      toast.error("Failed to verify student.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Coordinator Workspace">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const s = data?.stats || {};

  return (
    <DashboardLayout title="Coordinator workspace">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending verifications" value={s.totalStudents > 0 ? "Check List" : "0"} icon={<Clock className="h-4 w-4" />} accent="warning" />
        <StatCard label="Verified profiles" value={s.totalStudents?.toString() || "0"} icon={<CheckSquare className="h-4 w-4" />} accent="success" />
        <StatCard label="Active applications" value={s.activeDrives?.toString() || "0"} icon={<FileText className="h-4 w-4" />} accent="accent" />
        <StatCard label="Open threads" value="0" icon={<MessageSquare className="h-4 w-4" />} />
      </div>

    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
