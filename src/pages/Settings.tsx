import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRole } from "@/context/RoleContext";
import { User, Lock, Bell, Moon, Globe, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useRole();

  const handleSave = () => {
    toast.success("Preferences saved successfully!");
  };

  const handleDeleteProfile = () => {
    toast.error("Profile deletion initiated. This action requires administrative approval.");
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="max-w-4xl space-y-8 animate-fade-in">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-display font-semibold uppercase tracking-widest text-xs">
            <User className="h-4 w-4" /> Personal Information
          </div>
          <div className="surface-card p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name || ""} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user?.email || ""} disabled className="bg-secondary/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch / Department</Label>
              <Input id="branch" placeholder="e.g. Computer Science" />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-warning font-display font-semibold uppercase tracking-widest text-xs">
            <Lock className="h-4 w-4" /> Security & Password
          </div>
          <div className="surface-card p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="curr-pass">Current Password</Label>
                <Input id="curr-pass" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pass">New Password</Label>
                <Input id="new-pass" type="password" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-warning" />
                <div>
                  <div className="text-sm font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account.</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-accent font-display font-semibold uppercase tracking-widest text-xs">
            <Bell className="h-4 w-4" /> App Preferences
          </div>
          <div className="surface-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Dark Mode</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Switch between dark and light themes.</div>
                </div>
              </div>
              <Switch checked />
            </div>
            
            <div className="border-t border-border pt-6 flex items-center justify-between">
              <div className="flex gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Receive job alerts and interview invitations via email.</div>
                </div>
              </div>
              <Switch checked />
            </div>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-destructive font-display font-semibold uppercase tracking-widest text-xs">
            <AlertTriangle className="h-4 w-4" /> Danger Zone
          </div>
          <div className="surface-card p-6 border-destructive/20 bg-destructive/5 space-y-4">
            <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
              <div>
                <div className="text-sm font-semibold text-destructive">Delete Account & Profile</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Permanently remove your account, all personal data, and active applications. This action cannot be undone.
                </div>
              </div>
              <Button variant="destructive" onClick={handleDeleteProfile} className="shrink-0 bg-destructive/90 hover:bg-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
              </Button>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline">Reset Changes</Button>
          <Button onClick={handleSave} className="bg-gradient-maroon px-8">Save All Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
