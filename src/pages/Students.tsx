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
  { id: 1, name: "Ahmed Hassan", grade: "P3", gender: "Male", guardian: "Mohamed Hassan", phone: "+256 700 123 456", status: "active", district: "Kampala" },
  { id: 2, name: "Fatima Ali", grade: "P5", gender: "Female", guardian: "Ali Ibrahim", phone: "+256 700 123 457", status: "active", district: "Wakiso" },
  { id: 3, name: "Omar Mohamed", grade: "P2", gender: "Male", guardian: "Mohamed Yusuf", phone: "+256 700 123 458", status: "active", district: "Kampala" },
  { id: 4, name: "Aisha Abdi", grade: "P4", gender: "Female", guardian: "Abdi Ahmed", phone: "+256 700 123 459", status: "active", district: "Mukono" },
  { id: 5, name: "Yusuf Ibrahim", grade: "P1", gender: "Male", guardian: "Ibrahim Salah", phone: "+256 700 123 460", status: "inactive", district: "Kampala" },
  { id: 6, name: "Khadija Omar", grade: "P3", gender: "Female", guardian: "Omar Ali", phone: "+256 700 123 461", status: "active", district: "Wakiso" },
  { id: 7, name: "Hassan Ahmed", grade: "P7", gender: "Male", guardian: "Ahmed Hassan", phone: "+256 700 123 462", status: "active", district: "Kampala" },
  { id: 8, name: "Maryam Yusuf", grade: "P6", gender: "Female", guardian: "Yusuf Mohamed", phone: "+256 700 123 463", status: "active", district: "Mukono" },
  { id: 9, name: "Issa Mukasa", grade: "P7", gender: "Male", guardian: "Mukasa Ali", phone: "+256 700 123 464", status: "active", district: "Kampala" },
  { id: 10, name: "Amina Nabirye", grade: "P4", gender: "Female", guardian: "Nabirye Sarah", phone: "+256 700 123 465", status: "active", district: "Jinja" },
];

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Learners" subtitle="Manage learner records - Uganda New Curriculum">
      {/* Term Info */}
      <div className="rounded-lg border border-border bg-muted/50 p-3 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Current Term:</span> Term 3, 2024 | 
          <span className="font-medium text-foreground ml-2">Total Enrollment:</span> {students.length} learners
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
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Register Learner
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-6 rounded-xl border border-border bg-card animate-slide-up">
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
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{student.grade}</Badge>
                </TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.guardian}</TableCell>
                <TableCell>{student.district}</TableCell>
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
        <span>Showing {filteredStudents.length} of {students.length} learners</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
