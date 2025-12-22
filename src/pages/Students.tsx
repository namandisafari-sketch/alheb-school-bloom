import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter, MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react";
import { useLearners } from "@/hooks/useLearners";
import { RegisterLearnerDialog } from "@/components/students/RegisterLearnerDialog";

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: learners = [], isLoading, error } = useLearners();

  const filteredStudents = learners.filter((student) =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.class_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <DashboardLayout title="Learners" subtitle="Manage learner records - Uganda New Curriculum">
      {/* Term Info */}
      <div className="rounded-lg border border-border bg-muted/50 p-2 sm:p-3 mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Current Term:</span> Term 3, 2024 | 
          <span className="font-medium text-foreground ml-1 sm:ml-2">Total:</span> {learners.length} learners
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search learners..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <RegisterLearnerDialog>
            <Button size="sm" className="flex-1 sm:flex-none">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="sm:inline">Register</span>
            </Button>
          </RegisterLearnerDialog>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-4 sm:mt-6 rounded-xl border border-border bg-card animate-slide-up overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-destructive">
            Failed to load learners. Please try again.
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No learners found</p>
            <p className="text-sm">Register your first learner to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learner</TableHead>
                <TableHead className="hidden sm:table-cell">Class</TableHead>
                <TableHead className="hidden md:table-cell">Gender</TableHead>
                <TableHead className="hidden lg:table-cell">Guardian</TableHead>
                <TableHead className="hidden xl:table-cell">District</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs sm:text-sm font-medium text-primary">
                        {student.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-sm truncate block">{student.full_name}</span>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {student.class_name || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{student.class_name || "Unassigned"}</Badge>
                  </TableCell>
                  <TableCell className="capitalize hidden md:table-cell">{student.gender}</TableCell>
                  <TableCell className="hidden lg:table-cell">{student.guardian_name || "—"}</TableCell>
                  <TableCell className="hidden xl:table-cell">{student.district || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!student.guardian_phone}>
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "default" : "secondary"} className="text-xs">
                      {student.status || "active"}
                    </Badge>
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
        <span>Showing {filteredStudents.length} of {learners.length} learners</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
