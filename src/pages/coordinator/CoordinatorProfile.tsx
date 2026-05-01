import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/context/RoleContext";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const CoordinatorProfile = () => {
  const { user } = useRole();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Coordinator",
    phone: "",
    department: "Computer Science",
    designation: "Faculty Coordinator"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Coordinator profile updated successfully!");
      setSaving(false);
    }, 800);
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        <form onSubmit={handleSave} className="surface-card p-8 space-y-8">
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <div className="h-24 w-24 rounded-full bg-gradient-maroon grid place-items-center text-3xl font-bold text-white shadow-glow">
              {profile.name?.[0] || "C"}
            </div>
            <div>
              <h2 className="text-2xl font-display font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.designation} · {profile.department}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={user?.email || ""} disabled className="bg-secondary/20" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+91 1234567890" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Designation</Label>
              <Input value={profile.designation} onChange={e => setProfile({...profile, designation: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" disabled={saving} className="bg-gradient-maroon px-8">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorProfile;
