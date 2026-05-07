import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import { Loader2, TrendingUp, Info } from "lucide-react";
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip";

interface PredictionData {
  probability: number;
  grade: string;
  recommendations: string[];
  breakdown: Record<string, number>;
}

export function PlacementMeter() {
  const { user } = useRole();
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPrediction = async () => {
      try {
        const res = await api.prediction.get(user.id);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch prediction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [user?.id]);

  if (loading) return (
    <Card className="h-full border-border/40 bg-background/50 backdrop-blur-sm animate-pulse flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-primary/30 animate-spin" />
    </Card>
  );

  if (!data) return null;

  const getStatusColor = (prob: number) => {
    if (prob >= 70) return "text-success border-success/30 shadow-success/20";
    if (prob >= 40) return "text-warning border-warning/30 shadow-warning/20";
    return "text-destructive border-destructive/30 shadow-destructive/20";
  };

  const getProgressColor = (prob: number) => {
    if (prob >= 70) return "from-success/80 to-success";
    if (prob >= 40) return "from-warning/80 to-warning";
    return "from-destructive/80 to-destructive";
  };

  return (
    <Card className="h-full border-border/40 bg-background/50 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-display font-semibold tracking-wide text-muted-foreground uppercase">Placement Probability</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground/50" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] text-[10px] leading-relaxed">
                Calculated using weighted analysis of your CGPA, skills, projects, internships, and aptitude scores.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="flex flex-col items-center justify-center py-4 relative">
          {/* Progress Ring Simulation */}
          <div className="relative h-32 w-32 rounded-full border-[6px] border-secondary/50 flex items-center justify-center shadow-inner">
            <svg className="absolute -rotate-90 h-full w-full">
              <circle
                cx="64"
                cy="64"
                r="59"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 59}`}
                strokeDashoffset={`${2 * Math.PI * 59 * (1 - data.probability / 100)}`}
                className={`transition-all duration-1000 ease-out ${getStatusColor(data.probability)}`}
              />
            </svg>
            <div className="text-center">
              <div className="text-3xl font-display font-bold tracking-tighter leading-none">{data.probability}%</div>
              <div className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full border bg-background/50 ${getStatusColor(data.probability)}`}>
                {data.grade} READY
              </div>
            </div>
          </div>
          <TrendingUp className="absolute bottom-2 right-4 h-4 w-4 text-primary/40" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              <span>Score Breakdown</span>
              <span className="text-primary">Live Data</span>
            </div>
            <div className="grid grid-cols-5 gap-1 h-2">
              {Object.entries(data.breakdown).map(([key, value]) => (
                <TooltipProvider key={key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`h-full rounded-full transition-all hover:scale-y-125 ${getProgressColor(data.probability)}`}
                        style={{ opacity: 0.2 + (value / 35) * 0.8 }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="text-[10px] capitalize">
                      {key}: {value} pts
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">AI Recommendation</p>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-[11px] leading-relaxed italic text-muted-foreground">
              "{data.recommendations[0]}"
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
