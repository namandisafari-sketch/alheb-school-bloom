import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardCheck,
  Settings,
  Bell,
  LogOut,
  HardHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

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
  { icon: Calendar, label: "Schedule", path: "/schedule", roles: ["admin", "teacher", "staff"] },
  { icon: ClipboardCheck, label: "Attendance", path: "/attendance", roles: ["admin", "teacher"] },
];

const bottomNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings", roles: ["admin"] },
];

const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  parent: "Parent",
  staff: "Staff",
};

export const Sidebar = () => {
  const { user, role, signOut } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const filteredBottomItems = bottomNavItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
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

        {/* User Info */}
        <div className="border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent font-medium text-sidebar-accent-foreground">
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
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border p-4">
          {filteredBottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={signOut}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
