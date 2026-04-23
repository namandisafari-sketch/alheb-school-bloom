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
  Globe,
  Wallet,
  CreditCard,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  roles?: AppRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", roles: ["admin", "teacher", "staff"] },
  { icon: Users, label: "Learners", path: "/students", roles: ["admin", "teacher"] },
  { icon: GraduationCap, label: "Teachers", path: "/teachers", roles: ["admin"] },
  { icon: HardHat, label: "Staff & Workers", path: "/staff", roles: ["admin"] },
  { icon: BookOpen, label: "Classes", path: "/classes", roles: ["admin", "teacher"] },
  { icon: PenLine, label: "Marks Entry", path: "/marks", roles: ["admin", "teacher"] },
  { icon: FileText, label: "Reports", path: "/reports", roles: ["admin", "teacher"] },
  { icon: Calendar, label: "Schedule", path: "/schedule", roles: ["admin", "teacher", "staff"] },
  { icon: ClipboardCheck, label: "Attendance", path: "/attendance", roles: ["admin", "teacher"] },
  { icon: Wallet, label: "Salary", path: "/salary", roles: ["admin"] },
  { icon: CreditCard, label: "ID Cards", path: "/id-cards", roles: ["admin"] },
  { icon: UserCog, label: "User Management", path: "/users", roles: ["admin"] },
];

const bottomNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", path: "/notifications", roles: ["admin"] },
  { icon: Globe, label: "Site Settings", path: "/settings", roles: ["admin"] },
];

const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  parent: "Parent",
  staff: "Staff",
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose, collapsed = false }: SidebarProps) => {
  const { user, role, signOut } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const filteredBottomItems = bottomNavItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300 ease-in-out w-64",
        collapsed ? "lg:w-16" : "lg:w-64",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn("flex h-20 items-center justify-between border-b border-sidebar-border", collapsed ? "lg:px-2 px-6" : "px-6")}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className={cn("min-w-0", collapsed && "lg:hidden")}>
              <h1 className="font-display text-lg font-semibold text-sidebar-foreground truncate">
                Alheb Islamic
              </h1>
              <p className="text-xs text-sidebar-foreground/70 truncate">Primary School</p>
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
        <div className={cn("border-b border-sidebar-border py-3", collapsed ? "lg:px-2 px-4" : "px-4")}>
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
                  {roleLabels[role]}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 overflow-y-auto no-scrollbar", collapsed ? "lg:p-2 p-4" : "p-4")}>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              title={item.label}
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
              <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
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
              title={item.label}
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
              <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={signOut}
            title="Logout"
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-lg text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive px-4 py-3",
              collapsed && "lg:justify-center lg:px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn("truncate", collapsed && "lg:hidden")}>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
