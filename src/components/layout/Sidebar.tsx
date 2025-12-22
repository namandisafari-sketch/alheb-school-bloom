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
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const { user, role, signOut } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const filteredBottomItems = bottomNavItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-sidebar-foreground">
                Alheb Islamic
              </h1>
              <p className="text-xs text-sidebar-foreground/70">Primary School</p>
            </div>
          </div>
          {/* Mobile close button */}
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
        <div className="border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-medium text-sidebar-accent-foreground">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
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
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border p-4">
          {filteredBottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={signOut}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
