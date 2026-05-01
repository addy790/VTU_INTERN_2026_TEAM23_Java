import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { interviews } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon, Clock, Video } from "lucide-react";

const RecruiterInterviews = () => {
  const [open, setOpen] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast.success("Interview slot confirmed and invites sent successfully!");
  };

  return (
    <DashboardLayout title="Interviews & Scheduling">
      <div className="surface-card p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="font-display text-lg">Upcoming Schedules</div>
            <div className="text-xs text-muted-foreground mt-1">Manage technical and HR interview rounds</div>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-maroon hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" /> Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule a new interview</DialogTitle>
                <DialogDescription>
                  Send a calendar invite to the candidate with meeting details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSchedule} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Candidate Name</Label>
                  <Input placeholder="Search candidates..." required />
                </div>
                <div className="space-y-2">
                  <Label>Interview Round</Label>
                  <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Technical Assessment</option>
                    <option>Technical Round 1</option>
                    <option>Technical Round 2</option>
                    <option>HR Interview</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><CalendarIcon className="h-3 w-3"/> Date</Label>
                    <Input type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><Clock className="h-3 w-3"/> Time</Label>
                    <Input type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Video className="h-3 w-3"/> Meeting Link</Label>
                  <Input placeholder="https://meet.google.com/..." required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-maroon">Send Invites</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 max-w-4xl">
          {interviews.map(i => (
            <div key={i.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-4 min-w-[140px]">
                <div className="rounded-xl bg-gradient-maroon px-4 py-2 text-center shadow-glow">
                  <div className="text-[10px] text-primary-foreground/90 uppercase font-semibold tracking-widest">{new Date(i.date).toLocaleDateString([], { month: "short" })}</div>
                  <div className="text-xl font-bold text-white">{new Date(i.date).getDate()}</div>
                </div>
                <div>
                  <div className="font-semibold">{new Date(i.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{i.round}</div>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-border/60 mx-2"></div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-base truncate">{i.company} &mdash; {i.role}</div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <StatusBadge status={i.mode} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                     Candidate: <span className="font-medium text-foreground">John Doe</span>
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button size="sm" variant="outline" className="flex-1 sm:flex-auto min-w-[100px]">Reschedule</Button>
                <Button size="sm" variant="secondary" className="flex-1 sm:flex-auto min-w-[100px]">Join Call</Button>
              </div>
            </div>
          ))}
          {interviews.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p>No upcoming interviews scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterInterviews;
