import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
