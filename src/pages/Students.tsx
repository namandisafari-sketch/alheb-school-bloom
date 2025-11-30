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
import { Search, UserPlus, Filter, MoreHorizontal, Mail, Phone } from "lucide-react";

const students = [
  { id: 1, name: "Ahmed Hassan", grade: "Grade 3", gender: "Male", guardian: "Mohamed Hassan", phone: "+1234567890", status: "active" },
  { id: 2, name: "Fatima Ali", grade: "Grade 5", gender: "Female", guardian: "Ali Ibrahim", phone: "+1234567891", status: "active" },
  { id: 3, name: "Omar Mohamed", grade: "Grade 2", gender: "Male", guardian: "Mohamed Yusuf", phone: "+1234567892", status: "active" },
  { id: 4, name: "Aisha Abdi", grade: "Grade 4", gender: "Female", guardian: "Abdi Ahmed", phone: "+1234567893", status: "active" },
  { id: 5, name: "Yusuf Ibrahim", grade: "Grade 1", gender: "Male", guardian: "Ibrahim Salah", phone: "+1234567894", status: "inactive" },
  { id: 6, name: "Khadija Omar", grade: "Grade 3", gender: "Female", guardian: "Omar Ali", phone: "+1234567895", status: "active" },
  { id: 7, name: "Hassan Ahmed", grade: "Grade 5", gender: "Male", guardian: "Ahmed Hassan", phone: "+1234567896", status: "active" },
  { id: 8, name: "Maryam Yusuf", grade: "Grade 2", gender: "Female", guardian: "Yusuf Mohamed", phone: "+1234567897", status: "active" },
];

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Students" subtitle="Manage student records and information">
      {/* Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students by name or grade..."
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
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-6 rounded-xl border border-border bg-card animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Guardian</TableHead>
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
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.guardian}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.status === "active" ? "default" : "secondary"}>
                    {student.status}
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
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredStudents.length} of {students.length} students</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
