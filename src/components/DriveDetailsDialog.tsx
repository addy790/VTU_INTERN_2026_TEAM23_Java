import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Briefcase, Calendar, Info, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DriveDetailsDialog({
  open,
  onOpenChange,
  drive,
  onApply,
  hasApplied
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drive: any;
  onApply: (id: string) => void;
  hasApplied: boolean;
}) {
  if (!drive) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl surface-card border-border/40 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-secondary/80 grid place-items-center text-2xl font-bold text-primary">
              {drive.companyName?.[0]}
            </div>
            <div>
              <DialogTitle className="text-2xl font-display">{drive.role}</DialogTitle>
              <DialogDescription className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {drive.companyName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-9 w-9 rounded-full bg-secondary/40 grid place-items-center">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Package</div>
                <div className="font-medium">{drive.packageAmount}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-9 w-9 rounded-full bg-secondary/40 grid place-items-center">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Deadline</div>
                <div className="font-medium">{drive.deadline}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-9 w-9 rounded-full bg-secondary/40 grid place-items-center">
                <GraduationCap className="h-4 w-4 text-warning" />
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Min CGPA</div>
                <div className="font-medium">{drive.minCgpa}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-9 w-9 rounded-full bg-secondary/40 grid place-items-center">
                <MapPin className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Location</div>
                <div className="font-medium">Bangalore / Remote</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Job Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {drive.description || "As a Software Engineer at " + drive.companyName + ", you will be responsible for developing high-quality, scalable code. You will work within a cross-functional team to define and ship new features. Strong problem-solving skills and a solid understanding of data structures and algorithms are required."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Eligibility Criteria
            </h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{drive.eligibilityCriteria || "B.E / B.Tech (CSE, IT, ECE)"}</li>
              <li>No active backlogs at the time of recruitment.</li>
              <li>Strong understanding of Core Java or Python.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex gap-3 pt-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
          <Button 
            disabled={hasApplied}
            onClick={() => onApply(drive.id)}
            className={`flex-1 ${hasApplied ? "bg-secondary" : "bg-gradient-maroon"}`}
          >
            {hasApplied ? "Already Applied" : "Confirm Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
