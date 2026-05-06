import { Search, User, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 ml-4 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
             <div className={cn("h-2 w-2 rounded-full", navigator.onLine ? "bg-emerald-500" : "bg-red-500")} />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
               {navigator.onLine ? "Local Server Active" : "Local Server Offline"}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students, teachers..."
              className="w-64 pl-10"
            />
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
