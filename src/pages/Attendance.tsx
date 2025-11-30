import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Clock, Calendar } from "lucide-react";

const attendanceData = [
  { id: 1, name: "Ahmed Hassan", status: "present", time: "7:45 AM" },
  { id: 2, name: "Fatima Ali", status: "present", time: "7:50 AM" },
  { id: 3, name: "Omar Mohamed", status: "late", time: "8:15 AM" },
  { id: 4, name: "Aisha Abdi", status: "present", time: "7:55 AM" },
  { id: 5, name: "Yusuf Ibrahim", status: "absent", time: "-" },
  { id: 6, name: "Khadija Omar", status: "present", time: "7:48 AM" },
  { id: 7, name: "Hassan Ahmed", status: "present", time: "7:52 AM" },
  { id: 8, name: "Maryam Yusuf", status: "present", time: "7:58 AM" },
];

const statusConfig = {
  present: { icon: Check, color: "bg-success text-success-foreground", label: "Present" },
  absent: { icon: X, color: "bg-destructive text-destructive-foreground", label: "Absent" },
  late: { icon: Clock, color: "bg-warning text-warning-foreground", label: "Late" },
};

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState("grade-3");
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

  const presentCount = attendanceData.filter((s) => s.status === "present").length;
  const absentCount = attendanceData.filter((s) => s.status === "absent").length;
  const lateCount = attendanceData.filter((s) => s.status === "late").length;

  return (
    <DashboardLayout title="Attendance" subtitle="Track daily student attendance">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade-1">Grade 1</SelectItem>
              <SelectItem value="grade-2">Grade 2</SelectItem>
              <SelectItem value="grade-3">Grade 3</SelectItem>
              <SelectItem value="grade-4">Grade 4</SelectItem>
              <SelectItem value="grade-5">Grade 5</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{selectedDate}</span>
          </div>
        </div>
        <Button>Save Attendance</Button>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-card-foreground">{presentCount}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-card-foreground">{absentCount}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-card-foreground">{lateCount}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="mt-6 rounded-xl border border-border bg-card animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="border-b border-border p-4">
          <h3 className="font-display font-semibold text-card-foreground">Grade 3 - Attendance</h3>
          <p className="text-sm text-muted-foreground">Ustaz Ahmed • {attendanceData.length} students</p>
        </div>
        <div className="divide-y divide-border">
          {attendanceData.map((student) => {
            const config = statusConfig[student.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Checked in: {student.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={config.color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant={student.status === "present" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={student.status === "absent" ? "destructive" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={student.status === "late" ? "secondary" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
