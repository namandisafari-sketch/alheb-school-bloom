import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Phone, BookOpen } from "lucide-react";

const teachers = [
  {
    id: 1,
    name: "Ustaz Ibrahim Ahmed",
    email: "ibrahim@alheb.edu",
    phone: "+1234567890",
    subjects: ["Quran", "Arabic"],
    class: "Grade 1",
    status: "active",
    joinDate: "2020",
  },
  {
    id: 2,
    name: "Ustazah Amina Hassan",
    email: "amina@alheb.edu",
    phone: "+1234567891",
    subjects: ["Islamic Studies", "Arabic"],
    class: "Grade 2",
    status: "active",
    joinDate: "2019",
  },
  {
    id: 3,
    name: "Ustaz Ahmed Mohamed",
    email: "ahmed@alheb.edu",
    phone: "+1234567892",
    subjects: ["Math", "Science"],
    class: "Grade 3",
    status: "active",
    joinDate: "2021",
  },
  {
    id: 4,
    name: "Ustazah Fatima Ali",
    email: "fatima@alheb.edu",
    phone: "+1234567893",
    subjects: ["English", "Social Studies"],
    class: "Grade 4",
    status: "active",
    joinDate: "2018",
  },
  {
    id: 5,
    name: "Ustaz Mohamed Yusuf",
    email: "mohamed@alheb.edu",
    phone: "+1234567894",
    subjects: ["Quran", "Islamic Studies"],
    class: "Grade 5",
    status: "active",
    joinDate: "2017",
  },
  {
    id: 6,
    name: "Ustazah Khadija Omar",
    email: "khadija@alheb.edu",
    phone: "+1234567895",
    subjects: ["Computer", "Math"],
    class: "Support",
    status: "active",
    joinDate: "2022",
  },
];

const Teachers = () => {
  return (
    <DashboardLayout title="Teachers" subtitle="Manage teaching staff and assignments">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{teachers.length} teachers</p>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Teachers Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher, index) => (
          <div
            key={teacher.id}
            className="card-hover rounded-xl border border-border bg-card p-6 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold text-primary">
                {teacher.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-card-foreground truncate">
                  {teacher.name}
                </h3>
                <p className="text-sm text-muted-foreground">{teacher.class} Teacher</p>
                <Badge variant="default" className="mt-2">
                  {teacher.status}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{teacher.phone}</span>
              </div>
            </div>

            {/* Subjects */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <BookOpen className="h-3 w-3" />
                <span>Subjects</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                Since {teacher.joinDate}
              </span>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Teachers;
