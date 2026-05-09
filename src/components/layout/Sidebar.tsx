import { NavLink } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Search,
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
  Star,
  Bed,
  BookMarked,
  X,
  Shield,
  Layers,
  Scale,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface NavItem {
  icon: typeof LayoutDashboard;
  labelKey: string;
  path: string;
  roles?: AppRole[];
}

interface NavSection {
  titleKey: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    titleKey: "Overview",
    items: [
      { icon: LayoutDashboard, labelKey: "dashboard", path: "/", roles: ["admin", "teacher", "staff", "security", "head_teacher", "accountant"] },
      { icon: Calendar, labelKey: "program", path: "/calendar", roles: ["admin", "teacher", "staff", "security", "parent", "head_teacher", "accountant"] },
      { icon: Clock, labelKey: "schedule", path: "/schedule", roles: ["admin", "teacher", "staff", "security", "head_teacher"] },
    ],
  },
  {
    titleKey: "Academics",
    items: [
      { icon: Users, labelKey: "learners", path: "/students", roles: ["admin", "teacher", "head_teacher"] },
      { icon: BookOpen, labelKey: "classes", path: "/classes", roles: ["admin", "teacher", "head_teacher"] },
      { icon: PenLine, labelKey: "marksEntry", path: "/marks", roles: ["admin", "teacher", "head_teacher"] },
      { icon: BookMarked, labelKey: "homework", path: "/homework", roles: ["admin", "teacher", "head_teacher"] },
      { icon: ClipboardCheck, labelKey: "attendance", path: "/attendance", roles: ["admin", "teacher", "head_teacher"] },
      { icon: FileText, labelKey: "reports", path: "/reports", roles: ["admin", "teacher", "head_teacher"] },
      { icon: Star, labelKey: "madrasa", path: "/madrasa", roles: ["admin", "teacher", "staff", "head_teacher"] },
    ],
  },
  {
    titleKey: "People",
    items: [
      { icon: GraduationCap, labelKey: "teachers", path: "/teachers", roles: ["admin", "head_teacher"] },
      { icon: HardHat, labelKey: "staffWorkers", path: "/staff", roles: ["admin", "head_teacher"] },
      { icon: Layers, labelKey: "staffAssignments", path: "/staff-assignments", roles: ["admin"] },
      { icon: UserCog, labelKey: "userManagement", path: "/users", roles: ["admin", "head_teacher"] },
      { icon: CreditCard, labelKey: "idCards", path: "/id-cards", roles: ["admin", "head_teacher"] },
    ],
  },
  {
    titleKey: "Operations",
    items: [
      { icon: Shield, labelKey: "gatePasses", path: "/visitors", roles: ["admin", "staff", "security", "head_teacher"] },
      { icon: Box, labelKey: "inventory", path: "/inventory", roles: ["admin", "staff", "security", "head_teacher"] },
      { icon: Stethoscope, labelKey: "health", path: "/health", roles: ["admin", "teacher", "staff", "head_teacher"] },
      { icon: Bed, labelKey: "hostel", path: "/hostel", roles: ["admin", "staff", "head_teacher"] },
      { icon: Scale, labelKey: "discipline", path: "/discipline", roles: ["admin", "head_teacher"] },
    ],
  },
  {
    titleKey: "Finance",
    items: [
      { icon: Wallet, labelKey: "finance", path: "/accountant/accounts", roles: ["admin", "accountant"] },
      { icon: ShoppingCart, labelKey: "procurement", path: "/accountant/procurement", roles: ["admin", "accountant"] },
      { icon: Receipt, labelKey: "pettyCash", path: "/accountant/petty-cash", roles: ["admin", "accountant"] },
      { icon: CreditCard, labelKey: "payroll", path: "/accountant/payroll", roles: ["admin", "accountant"] },
      { icon: ClipboardCheck, labelKey: "auditLog", path: "/accountant/audit-log", roles: ["admin", "accountant"] },
    ],
  },
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
  const { isGlobalAdmin } = useIsAdmin();
  const [search, setSearch] = useState("");

  const allowed = (item: NavItem) => {
    if (item.path === "/staff-assignments" && !isGlobalAdmin) return false;
    return !item.roles || (role && item.roles.includes(role));
  };

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!allowed(item)) return false;
          if (!q) return true;
          return (
            t(item.labelKey).toLowerCase().includes(q) ||
            item.labelKey.toLowerCase().includes(q) ||
            item.path.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((section) => section.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, isGlobalAdmin]);

  const filteredBottomItems = bottomNavItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );


  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const roleLabel = role
    ? role === "admin"
      ? t("administrator")
      : role === "head_teacher"
      ? "Head Teacher"
      : role === "accountant"
      ? "Accountant"
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
                Alheib Mixed
              </h1>
              <p className="text-[10px] text-sidebar-foreground/70 truncate uppercase tracking-tighter">Day & Boarding School</p>
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

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/50" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search pages...")}
                className="w-full rounded-md bg-sidebar-accent/40 pl-8 pr-2 py-2 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50 outline-none focus:ring-2 focus:ring-sidebar-primary/40"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar",
            collapsed ? "lg:p-2 p-4" : "p-3"
          )}
        >
          {filteredSections.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-sidebar-foreground/50">
              {t("No pages found")}
            </p>
          )}
          {filteredSections.map((section) => (
            <div key={section.titleKey} className="mb-3">
              {!collapsed && (
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
                  {t(section.titleKey)}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={handleNavClick}
                    title={t(item.labelKey)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 px-3 py-2.5",
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
              </div>
            </div>
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
