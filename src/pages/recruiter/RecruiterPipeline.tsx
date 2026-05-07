import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, User, Search, Filter, MoreVertical, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AutoShortlistModal } from "@/components/AutoShortlistModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLUMNS = ["APPLIED", "SHORTLISTED", "TECHNICAL_ROUND", "HR_ROUND", "SELECTED", "REJECTED"];

const RecruiterPipeline = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [selectedDriveId, setSelectedDriveId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [appsData, drivesData] = await Promise.all([
        api.applications.getPipeline(),
        api.drives.getAll()
      ]);
      setApps(appsData);
      setDrives(drivesData);
    } catch (err) {
      toast.error("Failed to fetch pipeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const appId = draggableId;

    // Optimistic Update
    const oldApps = [...apps];
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));

    try {
      await api.applications.updateStatus(appId, newStatus);
      toast.success(`Candidate moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      setApps(oldApps);
      toast.error("Status update failed");
    }
  };

  const filteredApps = selectedDriveId === "all" 
    ? apps 
    : apps.filter(a => a.drive.id === selectedDriveId);

  const selectedDriveName = drives.find(d => d.id === selectedDriveId)?.companyName || "Select Drive";

  if (loading) return (
    <DashboardLayout title="Pipeline Management">
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Recruiter Kanban Board">
      <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-background/50 backdrop-blur-md p-3 rounded-xl border border-border/40 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input placeholder="Search candidate..." className="bg-secondary/40 border-none h-8 pl-8 pr-4 rounded-lg text-xs w-48 focus:ring-1" />
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={selectedDriveId} onValueChange={setSelectedDriveId}>
                <SelectTrigger className="h-8 w-48 bg-secondary/40 border-none text-[11px] font-medium">
                  <SelectValue placeholder="All Drives" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drives</SelectItem>
                  {drives.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.companyName} — {d.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {selectedDriveId !== "all" && (
               <Button 
                onClick={() => setIsShortlistModalOpen(true)}
                className="h-8 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-primary/20 text-[10px] uppercase tracking-widest font-bold transition-all"
               >
                 <Sparkles className="h-3.5 w-3.5 mr-2" /> Run AI Shortlist
               </Button>
             )}
             <Badge variant="outline" className="bg-success/5 text-success border-success/20 py-1 uppercase tracking-widest text-[9px] font-bold">
               <CheckCircle2 className="h-3 w-3 mr-1" /> Live Sync
             </Badge>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map((col) => {
              const colApps = filteredApps.filter(a => a.status === col);
              return (
                <div key={col} className="flex flex-col w-72 shrink-0 rounded-2xl bg-secondary/20 border border-border/40 overflow-hidden shadow-inner group">
                  <div className="p-4 border-b border-border/40 flex items-center justify-between bg-secondary/10">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        col === 'SELECTED' ? 'bg-success' : col === 'REJECTED' ? 'bg-destructive' : 'bg-primary'
                      }`} />
                      <h3 className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground">
                        {col.replace('_', ' ')}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border/40 shadow-sm">
                      {colApps.length}
                    </span>
                  </div>

                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar transition-colors ${
                          snapshot.isDraggingOver ? "bg-primary/5" : ""
                        }`}
                      >
                        {colApps.map((app, index) => (
                          <Draggable key={app.id} draggableId={app.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 rounded-xl border bg-background/80 shadow-md group/card transition-all ${
                                  snapshot.isDragging ? "rotate-3 scale-105 shadow-2xl border-primary" : "hover:border-primary/40"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-maroon grid place-items-center text-xs font-bold text-primary-foreground shadow-sm">
                                      {app.student.name?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold tracking-tight">{app.student.name}</div>
                                      <div className="text-[9px] text-muted-foreground uppercase">{app.student.branch}</div>
                                    </div>
                                  </div>
                                  <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="space-y-1.5">
                                  <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Badge variant="outline" className="h-4 text-[8px] bg-secondary border-none">{app.drive.companyName}</Badge>
                                    <span className="truncate max-w-[120px]">{app.drive.role}</span>
                                  </div>
                                  <div className="flex gap-1 flex-wrap pt-1">
                                    {(app.student.skills || []).slice(0, 3).map((s: string) => (
                                      <span key={s} className="text-[8px] bg-secondary/50 text-muted-foreground px-1 py-0.5 rounded border border-border/20">{s}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {colApps.length === 0 && (
                          <div className="h-32 rounded-xl border-2 border-dashed border-border/20 flex items-center justify-center text-[10px] text-muted-foreground/40 italic uppercase tracking-widest">
                            No Candidates
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {selectedDriveId !== "all" && (
        <AutoShortlistModal 
          driveId={selectedDriveId}
          driveName={selectedDriveName}
          open={isShortlistModalOpen}
          onOpenChange={setIsShortlistModalOpen}
          onComplete={fetchData}
        />
      )}
    </DashboardLayout>
  );
};

export default RecruiterPipeline;
