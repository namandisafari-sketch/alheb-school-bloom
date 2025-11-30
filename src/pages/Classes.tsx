import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, Plus, Clock, MapPin } from "lucide-react";

const classes = [
  {
    id: 1,
    name: "Primary 1 (P1)",
    teacher: "Ustaz Ibrahim",
    students: 32,
    capacity: 40,
    subjects: ["Literacy", "Numeracy", "IRE", "Arabic", "Quran", "Local Language"],
    room: "Room 101",
    schedule: "Mon-Fri 8:00 AM - 1:00 PM",
  },
  {
    id: 2,
    name: "Primary 2 (P2)",
    teacher: "Ustazah Amina",
    students: 35,
    capacity: 40,
    subjects: ["Literacy", "Numeracy", "IRE", "Arabic", "Quran", "Local Language"],
    room: "Room 102",
    schedule: "Mon-Fri 8:00 AM - 1:00 PM",
  },
  {
    id: 3,
    name: "Primary 3 (P3)",
    teacher: "Ustaz Ahmed",
    students: 38,
    capacity: 40,
    subjects: ["English", "Mathematics", "Science", "Social Studies", "IRE", "Arabic", "Quran"],
    room: "Room 103",
    schedule: "Mon-Fri 8:00 AM - 1:30 PM",
  },
  {
    id: 4,
    name: "Primary 4 (P4)",
    teacher: "Ustazah Fatima",
    students: 30,
    capacity: 40,
    subjects: ["English", "Mathematics", "Science", "Social Studies", "IRE", "Arabic", "Quran", "Kiswahili"],
    room: "Room 104",
    schedule: "Mon-Fri 8:00 AM - 2:00 PM",
  },
  {
    id: 5,
    name: "Primary 5 (P5)",
    teacher: "Ustaz Mohamed",
    students: 28,
    capacity: 40,
    subjects: ["English", "Mathematics", "Science", "Social Studies", "IRE", "Arabic", "Quran", "Kiswahili"],
    room: "Room 105",
    schedule: "Mon-Fri 8:00 AM - 2:30 PM",
  },
  {
    id: 6,
    name: "Primary 6 (P6)",
    teacher: "Ustazah Khadija",
    students: 25,
    capacity: 40,
    subjects: ["English", "Mathematics", "Science", "Social Studies", "IRE", "Arabic", "Quran", "Kiswahili"],
    room: "Room 106",
    schedule: "Mon-Fri 8:00 AM - 3:00 PM",
  },
  {
    id: 7,
    name: "Primary 7 (P7)",
    teacher: "Ustaz Yusuf",
    students: 22,
    capacity: 40,
    subjects: ["English", "Mathematics", "Science", "Social Studies", "IRE", "Arabic", "Quran", "Kiswahili"],
    room: "Room 107",
    schedule: "Mon-Fri 8:00 AM - 4:00 PM",
  },
];

const Classes = () => {
  return (
    <DashboardLayout title="Classes" subtitle="Uganda New Curriculum - P1 to P7 Structure">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">{classes.length} active classes</p>
          <p className="text-xs text-muted-foreground">Term 3, 2024 Academic Year</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((cls, index) => (
          <div
            key={cls.id}
            className="card-hover rounded-xl border border-border bg-card p-6 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-card-foreground">
                  {cls.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{cls.teacher}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Student Capacity */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Learners</span>
                </div>
                <span className="font-medium">
                  {cls.students}/{cls.capacity}
                </span>
              </div>
              <Progress value={(cls.students / cls.capacity) * 100} className="h-2" />
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{cls.room}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{cls.schedule}</span>
              </div>
            </div>

            {/* Subjects */}
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Learning Areas
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {cls.subjects.slice(0, 4).map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {subject}
                  </span>
                ))}
                {cls.subjects.length > 4 && (
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    +{cls.subjects.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Classes;
