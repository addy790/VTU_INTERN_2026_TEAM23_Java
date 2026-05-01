import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { candidates, pipelineStages, type PipelineStage } from "@/lib/mock-data";

const RecruiterPipeline = () => {
  return (
    <DashboardLayout title="Candidate Pipeline">
      <div className="surface-card p-6 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-display text-lg">Recruitment workflow</div>
            <div className="text-xs text-muted-foreground mt-1">Drag-and-drop to update candidate statuses</div>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-max">
            {pipelineStages.map((stage: PipelineStage) => {
              const items = candidates.filter(c => c.stage === stage);
              return (
                <div key={stage} className="flex flex-col w-72 rounded-xl bg-background/50 border border-border p-3 h-full">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground flex items-center gap-2">
                      {stage}
                      <span className="bg-secondary text-foreground text-[10px] px-1.5 py-0.5 rounded-full font-mono">{items.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {items.map(c => (
                      <div key={c.id} className="p-4 rounded-lg border border-border bg-card hover:border-primary/40 shadow-sm transition-all cursor-grab active:cursor-grabbing hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm leading-tight">{c.name}</div>
                          <div className="h-6 w-6 rounded-full bg-secondary/50 grid place-items-center text-[10px] font-bold text-primary shrink-0 opacity-70">
                            {c.name[0]}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">{c.role} · CGPA {c.cgpa}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {c.skills.slice(0, 3).map(k => <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/70 border border-border/50 text-foreground/80">{k}</span>)}
                          {c.skills.length > 3 && <span className="text-[9px] text-muted-foreground px-1 py-0.5">+{c.skills.length - 3}</span>}
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground/50">
                        Drop candidates here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterPipeline;
