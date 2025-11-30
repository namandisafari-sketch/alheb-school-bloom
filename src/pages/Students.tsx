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
      <div className="rounded-lg border border-border bg-muted/50 p-3 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Current Term:</span> Term 3, 2024 | 
          <span className="font-medium text-foreground ml-2">Total Enrollment:</span> {learners.length} learners
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search learners by name or class..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <RegisterLearnerDialog>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Register Learner
            </Button>
          </RegisterLearnerDialog>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-6 rounded-xl border border-border bg-card animate-slide-up">
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
                <TableHead>Learner Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                        {student.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium">{student.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class_name || "Unassigned"}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{student.gender}</TableCell>
                  <TableCell>{student.guardian_name || "—"}</TableCell>
                  <TableCell>{student.district || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!student.guardian_phone}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
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
