import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

export function NotificationBell() {
  const { user } = useRole();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    // 1. Initial Fetch
    const fetchNotifications = async () => {
      try {
        const data = await api.notifications.getAll(user.id);
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();

    // 2. WebSocket Connection
    const socketUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe(`/topic/notifications/${user.id}`, (message) => {
          const newNotif = JSON.parse(message.body);
          
          // Add to state
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast
          toast(newNotif.title, {
            description: newNotif.message,
          });
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-glow shadow-glow animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-2xl border-border/40 backdrop-blur-xl bg-background/95">
        <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">Notifications</div>
          <div className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
            {unreadCount} new
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border/20 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground italic">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`px-4 py-3 hover:bg-secondary/40 transition-colors cursor-pointer relative group ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-all ${
                    !n.read ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-transparent"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-none mb-1 group-hover:text-primary transition-colors">
                      {n.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {n.message}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border/40">
            <Button variant="ghost" className="w-full text-[10px] h-7 text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-bold">
              View all activity
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
