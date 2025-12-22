import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  MoreHorizontal,
  Loader2,
  Users,
  Shield,
  Car,
  UtensilsCrossed,
  Briefcase,
} from "lucide-react";
import { useAllStaff, STAFF_ROLES, StaffRole } from "@/hooks/useStaff";
import { AddStaffDialog } from "@/components/staff/AddStaffDialog";
import { format } from "date-fns";

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="h-4 w-4" />,
  driver: <Car className="h-4 w-4" />,
  cook: <UtensilsCrossed className="h-4 w-4" />,
  accountant: <Briefcase className="h-4 w-4" />,
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600",
  teacher: "bg-blue-500/10 text-blue-600",
  support: "bg-green-500/10 text-green-600",
  driver: "bg-orange-500/10 text-orange-600",
  security: "bg-red-500/10 text-red-600",
  cook: "bg-yellow-500/10 text-yellow-600",
  cleaner: "bg-cyan-500/10 text-cyan-600",
  accountant: "bg-indigo-500/10 text-indigo-600",
};

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { data: staff = [], isLoading, error } = useAllStaff();

  // Filter out teachers (they have their own page)
  const nonTeacherStaff = staff.filter((s) => s.role !== "teacher");

  const filteredStaff = nonTeacherStaff.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: string | null) => {
    const found = STAFF_ROLES.find((r) => r.value === role);
    return found?.label || role || "Staff";
  };

  // Stats
  const stats = STAFF_ROLES.filter((r) => r.value !== "teacher").map((role) => ({
    ...role,
    count: nonTeacherStaff.filter((s) => s.role === role.value).length,
  }));

  return (
    <DashboardLayout title="Staff & Workers" subtitle="Manage non-teaching staff and workers">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="rounded-lg border border-border bg-card p-2 sm:p-4 text-center"
          >
            <div className={`mx-auto mb-1 sm:mb-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${roleColors[stat.value] || "bg-muted"}`}>
              {roleIcons[stat.value] || <Users className="h-4 w-4 sm:h-5 sm:w-5" />}
            </div>
            <p className="text-lg sm:text-2xl font-bold">{stat.count}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2 sm:gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {STAFF_ROLES.filter((r) => r.value !== "teacher").map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddStaffDialog>
          <Button size="sm" className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </AddStaffDialog>
      </div>

      {/* Staff Table */}
      <div className="mt-4 sm:mt-6 rounded-xl border border-border bg-card animate-slide-up overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-destructive">
            Failed to load staff. Please try again.
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mb-4 opacity-50" />
            <p>No staff members found</p>
            <p className="text-sm">Add your first staff member to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Qualification</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-medium ${roleColors[member.role || ""] || "bg-primary/10 text-primary"}`}>
                        {member.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-sm block truncate">{member.full_name}</span>
                        {member.email && (
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        )}
                        <Badge variant="outline" className={`${roleColors[member.role || ""]} text-xs sm:hidden mt-1`}>
                          {getRoleLabel(member.role)}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className={roleColors[member.role || ""]}>
                      {getRoleLabel(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      {member.phone && (
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {member.email && (
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {!member.phone && !member.email && (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {member.qualification || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {member.created_at
                        ? format(new Date(member.created_at), "MMM yyyy")
                        : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Showing {filteredStaff.length} of {nonTeacherStaff.length} staff
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Staff;
