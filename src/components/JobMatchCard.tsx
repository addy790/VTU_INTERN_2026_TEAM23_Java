import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Building2, Calendar, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchResult {
  driveId: string;
  driveName: string;
  companyName: string;
  role: string;
  packageAmount: string;
  deadline: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function JobMatchCard({ match, onApply }: { match: MatchResult, onApply?: (id: string) => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success bg-success/10 border-success/20";
    if (score >= 60) return "text-warning bg-warning/10 border-warning/20";
    return "text-muted-foreground bg-secondary/50 border-border/40";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-primary";
  };

  return (
    <Card className="group relative overflow-hidden border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
      <div className={`absolute top-0 right-0 p-4 font-display font-bold text-2xl opacity-10 select-none group-hover:opacity-20 transition-opacity ${getScoreColor(match.matchScore).split(' ')[0]}`}>
        {match.matchScore}%
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Building2 className="h-3 w-3" />
              {match.companyName}
            </div>
            <h3 className="font-display text-lg font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-1">{match.role}</h3>
          </div>
          <Badge variant="outline" className={`font-mono text-xs ${getScoreColor(match.matchScore)}`}>
            {match.matchScore}% Match
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            {match.packageAmount}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {match.deadline ? new Date(match.deadline).toLocaleDateString() : "TBD"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">AI Matching Strength</div>
            <div className="text-xs font-mono font-bold">{match.matchScore}%</div>
          </div>
          <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${getProgressColor(match.matchScore)}`}
              style={{ width: `${match.matchScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-success/80">
              <CheckCircle2 className="h-3 w-3" />
              Matched Skills
            </div>
            <div className="flex flex-wrap gap-1">
              {match.matchedSkills.length > 0 ? (
                match.matchedSkills.map(s => (
                  <Badge key={s} variant="secondary" className="text-[10px] h-5 bg-success/5 text-success/80 border-success/10">{s}</Badge>
                ))
              ) : (
                <span className="text-[10px] text-muted-foreground italic">None detected</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-destructive/80">
              <AlertCircle className="h-3 w-3" />
              Skill Gaps
            </div>
            <div className="flex flex-wrap gap-1">
              {match.missingSkills.length > 0 ? (
                match.missingSkills.map(s => (
                  <Badge key={s} variant="secondary" className="text-[10px] h-5 bg-destructive/5 text-destructive/80 border-destructive/10">{s}</Badge>
                ))
              ) : (
                <span className="text-[10px] text-muted-foreground italic">No major gaps</span>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onApply?.(match.driveId)}
          className="w-full mt-2 h-9 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all duration-300"
        >
          View Details & Apply
        </Button>
      </CardContent>
    </Card>
  );
}
