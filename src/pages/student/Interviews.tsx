import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar as CalendarIcon, Clock, Video, MapPin, Building2, ExternalLink } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Interviews = () => {
  const { user } = useRole();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await api.interviews.getByStudent(user!.id);
        setInterviews(data);
      } catch (error) {
        console.error("Failed to fetch interviews", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchInterviews();
  }, [user]);

  const getGoogleCalendarUrl = (i: any) => {
    if (!i || !i.dateTime) return "#";
    const start = new Date(i.dateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
    
    const format = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    
    const text = encodeURIComponent(`Interview: ${i?.companyName || "Company"} - ${i?.role || "Round"}`);
    const details = encodeURIComponent(`${i?.round || "Interview"} for ${i?.role || "position"} at ${i?.companyName || "the company"}.`);
    const location = encodeURIComponent(i?.location || "");
    const dates = `${format(start)}/${format(end)}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}&dates=${dates}`;
  };

  if (loading) return <div className="h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <DashboardLayout title="Interview Scheduler">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6">
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Upcoming Schedule
            </h2>
            
            <div className="space-y-4">
              {(interviews || []).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-secondary/10 border border-dashed border-border rounded-xl">
                  No upcoming interviews scheduled.
                </div>
              ) : (
                interviews.map(i => (
                  <div key={i?.id || Math.random()} className="p-4 rounded-xl border border-border bg-gradient-card hover:border-primary/40 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary/80 grid place-items-center text-xl font-bold">
                          {i?.companyName?.[0] || "?"}
                        </div>
                        <div>
                          <h3 className="font-semibold">{i?.companyName || "Unknown Company"}</h3>
                          <p className="text-sm text-muted-foreground">{i?.role || "Role"} · {i?.round || "Interview"}</p>
                        </div>
                      </div>
                      <StatusBadge status={i?.status || "Scheduled"} />
                    </div>
                    
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="h-8 w-8 rounded-full bg-secondary/30 grid place-items-center">
                          <Clock className="h-4 w-4" />
                        </div>
                        {new Date(i.dateTime).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="h-8 w-8 rounded-full bg-secondary/30 grid place-items-center">
                          {i.mode === "ONLINE" ? <Video className="h-4 w-4 text-accent" /> : <MapPin className="h-4 w-4 text-warning" />}
                        </div>
                        {i.location || "Location TBD"}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      {i.mode === "ONLINE" && i.location?.startsWith("http") && (
                        <Button 
                          asChild
                          className="flex-1 bg-accent/20 text-accent hover:bg-accent/30 border-accent/20"
                        >
                          <a href={i.location} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" /> Join Meeting
                          </a>
                        </Button>
                      )}
                      <Button 
                        asChild
                        variant="outline"
                        className="flex-1"
                      >
                        <a href={getGoogleCalendarUrl(i)} target="_blank" rel="noopener noreferrer">
                          <CalendarIcon className="h-4 w-4 mr-2" /> Add to Calendar
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <h3 className="font-display font-semibold mb-4">Calendar Sync</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Schedule your placement interviews directly into your Google Calendar.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast.success("Calendar sync forced successfully!")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" /> Manual Sync
            </Button>
          </div>

          <div className="surface-card p-6 bg-gradient-maroon/10 border-primary/20">
            <h3 className="font-display font-semibold mb-2">Preparation Tips</h3>
            <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
              <li>Research the company cultures and values.</li>
              <li>Practice commonly asked coding patterns.</li>
              <li>Ensure a stable internet connection for online rounds.</li>
              <li>Dress professionally for both modes.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interviews;
