import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { api } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ParsedData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: string;
  projectCount: number;
  internshipCount: number;
  rawText: string;
  resumeUrl: string;
}

export function ResumeUploadDialog({ onComplete }: { onComplete?: () => void }) {
  const { user } = useRole();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleUpload = async () => {
    if (!file || !user?.id) return;
    setLoading(true);
    try {
      const data = await api.resume.upload(user.id, file);
      setParsedData(data);
      toast.success("Resume parsed successfully! Please review the details.");
    } catch (error: any) {
      toast.error(error.message || "Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsedData || !user?.id) return;
    setConfirming(true);
    try {
      await api.resume.confirm(user.id, parsedData);
      toast.success("Profile updated successfully!");
      setOpen(false);
      reset();
      if (onComplete) onComplete();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setConfirming(false);
    }
  };

  const reset = () => {
    setFile(null);
    setParsedData(null);
    setLoading(false);
    setConfirming(false);
  };

  const removeSkill = (skill: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter(s => s !== skill)
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          <FileUp className="h-4 w-4" />
          AI Resume Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border/40 shadow-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-display font-semibold tracking-tight">AI Resume Intelligence</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload your resume and our AI will automatically extract your skills, experience, and profile details.
          </DialogDescription>
        </DialogHeader>

        {!parsedData ? (
          <div className="p-6 pt-2 space-y-6">
            <div 
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                file ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-primary/30 hover:bg-secondary/30"
              }`}
            >
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept=".pdf,.docx" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary grid place-items-center mb-1 shadow-sm">
                  <FileUp className={`h-6 w-6 ${file ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready to parse</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PDF or DOCX (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
            <Button 
              className="w-full h-11" 
              disabled={!file || loading} 
              onClick={handleUpload}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing Resume Intelligence...
                </>
              ) : (
                "Start AI Analysis"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[450px]">
            <ScrollArea className="flex-1 p-6 pt-2">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Extracted Name</Label>
                    <Input 
                      value={parsedData.name} 
                      onChange={(e) => setParsedData({...parsedData, name: e.target.value})}
                      className="h-9 bg-secondary/30 border-border/40 focus:ring-1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Contact Number</Label>
                    <Input 
                      value={parsedData.phone} 
                      onChange={(e) => setParsedData({...parsedData, phone: e.target.value})}
                      className="h-9 bg-secondary/30 border-border/40 focus:ring-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Identified Skills</Label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-secondary/30 border border-border/40 min-h-[60px]">
                    {parsedData.skills.length > 0 ? (
                      parsedData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="pl-2 pr-1 h-6 gap-1 bg-background/50 border-border/40">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No skills detected</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">Projects</p>
                      <p className="text-sm font-semibold">{parsedData.projectCount} Detected</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">Internships</p>
                      <p className="text-sm font-semibold">{parsedData.internshipCount} Detected</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Raw Text Preview</Label>
                  <div className="text-[11px] p-3 rounded-lg bg-secondary/30 border border-border/40 text-muted-foreground leading-relaxed italic">
                    {parsedData.rawText}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border/40 bg-secondary/20 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setParsedData(null)}>Re-upload</Button>
              <Button className="flex-[2]" onClick={handleConfirm} disabled={confirming}>
                {confirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  "Confirm & Save Profile"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
