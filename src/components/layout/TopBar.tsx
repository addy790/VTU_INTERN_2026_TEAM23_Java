import { Bell, Search, ChevronDown } from "lucide-react";
import { useRole, roleMeta } from "@/context/RoleContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";

export function TopBar({ title }: { title?: string }) {
  const { role, user, logout } = useRole();
  const meta = roleMeta[role];
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
      <div className="lg:hidden"><Logo size="sm" /></div>
      <div className="hidden lg:block">
        <h1 className="font-display text-xl font-medium tracking-tight">{title || meta.label + " Dashboard"}</h1>
        <p className="text-xs text-muted-foreground -mt-0.5">{meta.tagline}</p>
      </div>

      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search drives, students, companies…"
            className="w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-12 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 hover:bg-secondary transition-colors">
              <div className="h-7 w-7 rounded-md bg-gradient-maroon grid place-items-center text-xs font-semibold text-primary-foreground">
                {user?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-medium">{user?.name || user?.email || "User"}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{role}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/${role}/profile`}>My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
