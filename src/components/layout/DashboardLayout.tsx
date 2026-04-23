import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("sidebar_collapsed") === "1";
  });
  const { isRTL } = useLanguage();

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          isRTL
            ? collapsed
              ? "lg:mr-16"
              : "lg:mr-64"
            : collapsed
            ? "lg:ml-16"
            : "lg:ml-64"
        )}
      >
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg font-semibold text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center gap-2 px-4 pt-3">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed((c) => !c)} className="shrink-0">
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Header title={title} subtitle={subtitle} />
          </div>
        </div>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
