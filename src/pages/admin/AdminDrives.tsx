import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const AdminDrives = () => {
  const [realDrives, setRealDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrives = async () => {
    try {
      const driveList = await api.drives.getAll();
      setRealDrives(driveList);
    } catch (err) {
      toast.error("Failed to fetch drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
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
      fetchDrives();
    } catch (err) {
      toast.error("Failed to publish drive.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Placement Drives">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Drives">
      <div className="surface-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-display text-lg">Active drives</div>
            <div className="text-xs text-muted-foreground mt-1">Manage ongoing and upcoming placements</div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-maroon hover:opacity-90"><Plus className="h-3.5 w-3.5 mr-1.5" />New Drive</Button>
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
        <div className="space-y-3">
          {realDrives.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-lg">No active drives found. Create one.</div>
          ) : (
            realDrives.map(d => (
              <div key={d.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/40 transition-colors">
                <div className="min-w-0">
                  <div className="text-base font-medium">{d.companyName}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{d.role} · {d.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">{d.packageAmount}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">{new Date(d.deadline).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDrives;
