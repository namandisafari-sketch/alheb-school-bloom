import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Bell,
  LogOut,
  HardHat,
  UserCog,
  PenLine,
  FileText,
  Settings,
  Wallet,
  CreditCard,
  Receipt,
  UserCheck,
  Box,
  Clock,
  Stethoscope,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavItem {
  icon: typeof LayoutDashboard;
  labelKey: string;
  path: string;
  roles?: AppRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "dashboard", path: "/", roles: ["admin", "teacher", "staff", "security"] },
  { icon: Users, labelKey: "learners", path: "/students", roles: ["admin", "teacher"] },
  { icon: GraduationCap, labelKey: "teachers", path: "/teachers", roles: ["admin"] },
  { icon: HardHat, labelKey: "staffWorkers", path: "/staff", roles: ["admin"] },
  { icon: BookOpen, labelKey: "classes", path: "/classes", roles: ["admin", "teacher"] },
  { icon: PenLine, labelKey: "marksEntry", path: "/marks", roles: ["admin", "teacher"] },
  { icon: FileText, labelKey: "reports", path: "/reports", roles: ["admin", "teacher"] },
  { icon: Calendar, labelKey: "program", path: "/calendar", roles: ["admin", "teacher", "staff", "security", "parent"] },
  { icon: Clock, labelKey: "schedule", path: "/schedule", roles: ["admin", "teacher", "staff", "security"] },
  { icon: UserCheck, labelKey: "visitors", path: "/visitors", roles: ["admin", "staff", "security"] },
  { icon: Box, labelKey: "inventory", path: "/inventory", roles: ["admin", "staff", "security"] },
  { icon: Stethoscope, labelKey: "health", path: "/health", roles: ["admin", "teacher", "staff"] },
  { icon: ClipboardCheck, labelKey: "attendance", path: "/attendance", roles: ["admin", "teacher"] },
  { icon: Receipt, labelKey: "feeManagement", path: "/fees", roles: ["admin", "staff"] },
  { icon: Wallet, labelKey: "salary", path: "/salary", roles: ["admin"] },
  { icon: CreditCard, labelKey: "idCards", path: "/id-cards", roles: ["admin"] },
  { icon: UserCog, labelKey: "userManagement", path: "/users", roles: ["admin"] },
];

const bottomNavItems: NavItem[] = [
  { icon: UserCog, labelKey: "accountSettings", path: "/account-settings" },
  { icon: Bell, labelKey: "notifications", path: "/notifications", roles: ["admin"] },
  { icon: Settings, labelKey: "systemSettings", path: "/settings", roles: ["admin"] },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose, collapsed = false }: SidebarProps) => {
  const { user, role, signOut } = useAuth();
  const { t, isRTL } = useLanguage();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const filteredBottomItems = bottomNavItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const roleLabel = role
    ? role === "admin"
      ? t("administrator")
      : role === "teacher"
      ? t("teacher")
      : role === "parent"
      ? t("parent")
      : role === "security"
      ? t("Security/Gatekeeper")
      : t("staff")
    : "";

  const sideClass = isRTL
    ? cn(
        "fixed right-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300 ease-in-out w-64",
        collapsed ? "lg:w-16" : "lg:w-64",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "translate-x-full"
      )
    : cn(
        "fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300 ease-in-out w-64",
        collapsed ? "lg:w-16" : "lg:w-64",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      );

  return (
    <aside className={sideClass}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-20 items-center justify-between border-b border-sidebar-border",
            collapsed ? "lg:px-2 px-6" : "px-6"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className={cn("min-w-0", collapsed && "lg:hidden")}>
              <h1 className="font-display text-lg font-semibold text-sidebar-foreground truncate">
                Alheb Islamic
              </h1>
              <p className="text-xs text-sidebar-foreground/70 truncate">{t("primarySchool")}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div
          className={cn(
            "border-b border-sidebar-border py-3",
            collapsed ? "lg:px-2 px-4" : "px-4"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-medium text-sidebar-accent-foreground">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className={cn("flex-1 min-w-0", collapsed && "lg:hidden")}>
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              {role && (
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {roleLabel}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 space-y-1 overflow-y-auto no-scrollbar",
            collapsed ? "lg:p-2 p-4" : "p-4"
          )}
        >
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              title={t(item.labelKey)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 px-4 py-3",
                  collapsed && "lg:justify-center lg:px-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn("truncate", collapsed && "lg:hidden")}>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className={cn("border-t border-sidebar-border", collapsed ? "lg:p-2 p-4" : "p-4")}>
          {filteredBottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              title={t(item.labelKey)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 px-4 py-3",
                  collapsed && "lg:justify-center lg:px-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn("truncate", collapsed && "lg:hidden")}>{t(item.labelKey)}</span>
            </NavLink>
          ))}
          <button
            onClick={signOut}
            title={t("logout")}
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-lg text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive px-4 py-3",
              collapsed && "lg:justify-center lg:px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn("truncate", collapsed && "lg:hidden")}>{t("logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
