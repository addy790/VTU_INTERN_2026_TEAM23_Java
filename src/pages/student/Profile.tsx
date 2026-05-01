import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRole } from "@/context/RoleContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Save, User } from "lucide-react";

const Profile = () => {
  const { user } = useRole();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    name: "",
    phone: "",
    alternateEmail: "",
    bio: "",
    githubUrl: "",
    linkedInUrl: "",
    graduationYear: new Date().getFullYear(),
    branch: "",
    skills: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.students.getById(user!.id);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.students.update(user!.id, profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSave} className="surface-card p-8 space-y-8">
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <div className="h-24 w-24 rounded-full bg-gradient-maroon grid place-items-center text-3xl font-bold text-white shadow-glow">
              {profile.name?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-2xl font-display font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.branch} · Class of {profile.graduationYear}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={profile.phone || ""} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+91 1234567890" />
            </div>
            <div className="space-y-2">
              <Label>Alternate Email</Label>
              <Input type="email" value={profile.alternateEmail || ""} onChange={e => setProfile({...profile, alternateEmail: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Input type="number" value={profile.graduationYear} onChange={e => setProfile({...profile, graduationYear: parseInt(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Short Bio</Label>
            <Textarea 
              value={profile.bio || ""} 
              onChange={e => setProfile({...profile, bio: e.target.value})} 
              placeholder="Tell recruiters about yourself..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input value={profile.githubUrl || ""} onChange={e => setProfile({...profile, githubUrl: e.target.value})} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input value={profile.linkedInUrl || ""} onChange={e => setProfile({...profile, linkedInUrl: e.target.value})} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>

          <div className="flex justify-end">
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

export default Profile;
