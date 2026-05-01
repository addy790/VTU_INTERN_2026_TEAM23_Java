import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, Info, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { Loader2 } from "lucide-react";
import { studentNotifications, adminNotifications, Notification } from "@/lib/mock-data";

const Notifications = () => {
  const { user, role } = useRole();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now using mock, but ready for real API
    // const fetchNotifications = async () => { ... }
    const notifications = role === "admin" ? adminNotifications : studentNotifications;
    setNotifs(notifications);
    setLoading(false);
  }, [user, role]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning": return <Clock className="h-5 w-5 text-warning" />;
      case "error": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default: return <Info className="h-5 w-5 text-info" />;
    }
  };

  if (loading) return <div className="h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <DashboardLayout title="Notifications Center">
      <div className="max-w-3xl mx-auto space-y-4">
        {notifs.map(n => (
          <div key={n.id} className="surface-card p-5 flex gap-4 transition-colors hover:bg-secondary/20">
            <div className="mt-1">{getIcon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-medium text-sm">{n.title}</h3>
                <span className="text-[10px] text-muted-foreground uppercase">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
