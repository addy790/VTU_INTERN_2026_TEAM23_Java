import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageSquare, Search, PlusCircle, Reply } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CoordinatorMessages = () => {
  const communications = [
    { id: 1, from: "Northwind Labs", msg: "Confirming candidate list for Round 2 — please share by Friday EOD.", time: "1h ago", unread: true },
    { id: 2, from: "Priya Nair", msg: "I've uploaded the updated resume. Could you re-verify it when you have a moment?", time: "3h ago", unread: true },
    { id: 3, from: "Halcyon Capital", msg: "Can we schedule a sync for HR rounds next Tuesday to discuss logistics?", time: "Yesterday", unread: false },
    { id: 4, from: "Aarav Mehta", msg: "Is there any update on the upcoming Microsoft drive eligibility?", time: "2 days ago", unread: false },
  ];

  return (
    <DashboardLayout title="Communications Inbox">
      <div className="surface-card p-0 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg px-2">Inbox</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 w-[280px] h-9 bg-secondary/30 border-transparent focus:border-border" />
            </div>
          </div>
          <Button size="sm" className="bg-gradient-maroon"><PlusCircle className="h-4 w-4 mr-2" /> New Message</Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {communications.map((m) => (
            <div key={m.id} className={`p-4 border-b border-border/50 hover:bg-secondary/20 transition-colors flex gap-4 cursor-pointer ${m.unread ? 'bg-primary/5' : ''}`}>
              <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center font-semibold shrink-0">
                {m.from[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <span className={`text-sm ${m.unread ? 'font-bold' : 'font-medium'}`}>{m.from}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{m.time}</span>
                </div>
                <p className={`text-sm ${m.unread ? 'text-foreground' : 'text-muted-foreground'} line-clamp-1`}>
                  {m.msg}
                </p>
                <div className="flex gap-3 mt-3 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                   <Button size="sm" variant="ghost" className="h-7 text-xs px-2"><Reply className="h-3 w-3 mr-1.5"/> Reply</Button>
                </div>
              </div>
              {m.unread && (
                 <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></div>
              )}
            </div>
          ))}
          {communications.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <MessageSquare className="h-12 w-12 opacity-20 mb-4" />
              <p>You have no messages in your inbox.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorMessages;
