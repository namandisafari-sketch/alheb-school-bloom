import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter, MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react";
import { useLearners } from "@/hooks/useLearners";
import { RegisterLearnerDialog } from "@/components/students/RegisterLearnerDialog";
import { LearnerActions } from "@/components/students/LearnerActions";

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

      {/* Students Grid */}
      <div className="mt-4 sm:mt-6 animate-slide-up">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-destructive">
            Failed to load learners. Please try again.
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <p>No learners found</p>
            <p className="text-sm">Register your first learner to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="group relative rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {student.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate pr-6">{student.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{student.admission_number || 'No ADM'}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LearnerActions learner={student} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Class:</span>
                    <Badge variant="outline" className="font-medium">{student.class_name || "Unassigned"}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Guardian:</span>
                    <span className="font-medium truncate max-w-[120px]">{student.guardian_name || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="capitalize">{student.gender}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <Badge variant={student.status === "active" ? "default" : "secondary"} className="text-[10px] h-5">
                    {student.status || "active"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!student.guardian_phone}>
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
