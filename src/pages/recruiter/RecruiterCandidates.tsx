import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Filter, Loader2, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const RecruiterCandidates = () => {
  const [q, setQ] = useState("");
  const [minCgpa, setMinCgpa] = useState(0);
  const [realStudents, setRealStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentList = await api.students.getAll();
        setRealStudents(studentList);
      } catch (err) {
        console.error("Failed to fetch students", err);
        toast.error("Failed to load candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = (realStudents || []).filter(s =>
    (s?.name?.toLowerCase().includes(q.toLowerCase()) || (s?.skills && s.skills.join(" ").toLowerCase().includes(q.toLowerCase())))
    && (s?.cgpa || 0) >= minCgpa
  );

  const handleViewResume = (student: any) => {
    setSelectedStudent(student);
    setResumeOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout title="Candidates">
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Candidate Discovery">
      <div className="surface-card p-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="font-display text-lg">Candidate repository</div>
            <div className="text-xs text-muted-foreground mt-1">Discover, filter, and shortlist talent</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills, name..." className="pl-9 w-48 sm:w-64 h-9 text-xs" />
            </div>
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 bg-background">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Min CGPA</span>
              <input 
                type="range" min="0" max="10" step="0.5" 
                value={minCgpa} onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                className="w-20 sm:w-24"
              />
              <span className="text-xs font-mono w-6">{minCgpa}</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s?.id || Math.random()} className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors group flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-maroon grid place-items-center text-sm font-semibold text-primary-foreground shadow-glow">
                    {s?.name ? s.name.split(" ").map((p: any) => p[0]).join("").slice(0, 2) : "??"}
                  </div>
                  <div>
                    <div className="font-medium">{s?.name || "Unknown Candidate"}</div>
                    <div className="text-xs text-muted-foreground">{s?.branch || "Branch N/A"} · {s?.cgpa?.toFixed(1) || "0.0"} CGPA</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(s?.skills || []).slice(0, 4).map((k: any) => (
                    <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border">{k}</span>
                  ))}
                  {(s?.skills?.length || 0) > 4 && (
                    <span className="text-[10px] text-muted-foreground font-medium">+{s.skills.length - 4}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleViewResume(s)}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Resume
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-maroon h-8 text-xs font-semibold">Shortlist</Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground text-sm">No candidates match your current filters.</div>}
        </div>
      </div>

      <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden bg-background">
          <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between shrink-0">
            <div>
              <DialogTitle className="text-lg font-display">{selectedStudent?.name}'s Resume</DialogTitle>
              <DialogDescription className="text-xs">{selectedStudent?.branch} · {selectedStudent?.cgpa} CGPA</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" /> Download Document</Button>
            </div>
          </div>
          <div className="flex-1 bg-secondary/10 grid place-items-center">
            <div className="w-[70%] h-[90%] bg-card border border-border shadow-2xl p-8 rounded flex flex-col">
              {/* Simulated Resume Document View */}
              <div className="text-center pb-6 border-b border-border">
                <h1 className="text-2xl font-bold font-serif">{selectedStudent?.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{selectedStudent?.user?.email || "student@email.com"} | {selectedStudent?.phone || "+91 0000000000"} | github.com/{selectedStudent?.name?.split(" ")[0]?.toLowerCase() || "student"}</p>
              </div>
              <div className="mt-6 space-y-6 flex-1 overflow-y-auto pr-4">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Education</h3>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-medium">University Placement Institute</div>
                    <div className="text-xs text-muted-foreground">Class of {selectedStudent?.graduationYear || "2024"}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">B.Tech in {selectedStudent?.branch} (CGPA: {selectedStudent?.cgpa})</div>
                </section>
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Technical Skills</h3>
                  <p className="text-sm">{(selectedStudent?.skills || []).join(", ") || "No skills listed."}</p>
                </section>
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">About Me</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedStudent?.bio || "A highly motivated student looking for an exciting role in software engineering to leverage my technical skills and contribute to impactful projects."}</p>
                </section>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RecruiterCandidates;
