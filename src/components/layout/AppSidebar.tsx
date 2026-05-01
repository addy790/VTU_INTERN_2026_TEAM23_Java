import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, FileText, Bell, Calendar, Users,
  CheckSquare, BarChart3, KanbanSquare, GraduationCap, Building2, MessageSquare, Settings,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useRole, roleMeta, type Role } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

const NAV: Record<Role, { to: string; label: string; icon: any }[]> = {
  student: [
    { to: "/student", label: "Overview", icon: LayoutDashboard },
    { to: "/student/drives", label: "Job Drives", icon: Briefcase },
    { to: "/student/applications", label: "Applications", icon: FileText },
    { to: "/student/interviews", label: "Interviews", icon: Calendar },
    { to: "/student/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/drives", label: "Drives", icon: Briefcase },
    { to: "/admin/students", label: "Students", icon: GraduationCap },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
  ],
  coordinator: [
    { to: "/coordinator", label: "Overview", icon: LayoutDashboard },
    { to: "/coordinator/verify", label: "Verification", icon: CheckSquare },
    { to: "/coordinator/applications", label: "Applications", icon: FileText },
    { to: "/coordinator/messages", label: "Messages", icon: MessageSquare },
  ],
  recruiter: [
    { to: "/recruiter", label: "Overview", icon: LayoutDashboard },
    { to: "/recruiter/candidates", label: "Candidates", icon: Users },
    { to: "/recruiter/pipeline", label: "Pipeline", icon: KanbanSquare },
    { to: "/recruiter/interviews", label: "Interviews", icon: Calendar },
  ],
};

export function AppSidebar() {
  const { role, user } = useRole();
  const meta = roleMeta[role];
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-sidebar-border bg-sidebar">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Logo />
      </div>

      <div className="px-4 py-4">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in as</div>
          <div className="mt-0.5 text-sm font-medium text-sidebar-foreground">{user?.name || user?.email}</div>
          <div className="text-xs text-muted-foreground">{meta.label}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Workspace</div>
        {NAV[role].map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== `/${role}` && location.pathname.startsWith(to));
          return (
            <NavLink
              key={to}
              to={to}
              end={to === `/${role}`}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground border-l-2 border-transparent"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary-glow" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5">
        <NavLink to="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
