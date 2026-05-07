import {
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SkillGapData {
  subject: string;
  student: number;
  required: number;
  fullMark: number;
}

export function SkillGapRadar({ data, loading }: { data: any, loading?: boolean }) {
  if (loading) return (
    <Card className="h-full border-border/40 bg-background/50 backdrop-blur-sm animate-pulse flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-primary/30 animate-spin" />
    </Card>
  );

  // Transform match result into radar data
  // Heuristic mapping for the 5-axis radar
  const radarData: SkillGapData[] = [
    { subject: 'Skills', student: data.matchScore > 80 ? 90 : data.matchScore > 50 ? 60 : 30, required: 85, fullMark: 100 },
    { subject: 'CGPA', student: data.cgpaScore * 10, required: 75, fullMark: 100 },
    { subject: 'Dept', student: data.departmentMatch ? 100 : 0, required: 100, fullMark: 100 },
    { subject: 'Projects', student: 70, required: 80, fullMark: 100 },
    { subject: 'Exp', student: 40, required: 60, fullMark: 100 },
  ];

  return (
    <Card className="h-full border-border/40 bg-background/50 backdrop-blur-md shadow-xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-display font-semibold tracking-wide text-muted-foreground uppercase">Skill Gap Radar</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] p-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Required"
              dataKey="required"
              stroke="#666"
              fill="#666"
              fillOpacity={0.1}
            />
            <Radar
              name="Student"
              dataKey="student"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 pb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Your Profile
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-muted" />
            Market Level
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
