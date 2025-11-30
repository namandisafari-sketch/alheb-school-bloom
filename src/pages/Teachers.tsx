import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Phone, BookOpen } from "lucide-react";

const teachers = [
  {
    id: 1,
    name: "Ustaz Ibrahim Ahmed",
    email: "ibrahim@alheb.edu",
    phone: "+256 700 234 567",
    subjects: ["Literacy", "Numeracy", "IRE"],
    class: "P1",
    status: "active",
    joinDate: "2020",
    qualification: "Diploma in Primary Education",
  },
  {
    id: 2,
    name: "Ustazah Amina Hassan",
    email: "amina@alheb.edu",
    phone: "+256 700 234 568",
    subjects: ["Literacy", "IRE", "Arabic"],
    class: "P2",
    status: "active",
    joinDate: "2019",
    qualification: "Bachelor of Education",
  },
  {
    id: 3,
    name: "Ustaz Ahmed Mohamed",
    email: "ahmed@alheb.edu",
    phone: "+256 700 234 569",
    subjects: ["Mathematics", "Science"],
    class: "P3",
    status: "active",
    joinDate: "2021",
    qualification: "Bachelor of Science Education",
  },
  {
    id: 4,
    name: "Ustazah Fatima Ali",
    email: "fatima@alheb.edu",
    phone: "+256 700 234 570",
    subjects: ["English", "Social Studies"],
    class: "P4",
    status: "active",
    joinDate: "2018",
    qualification: "Bachelor of Arts Education",
  },
  {
    id: 5,
    name: "Ustaz Mohamed Yusuf",
    email: "mohamed@alheb.edu",
    phone: "+256 700 234 571",
    subjects: ["Quran", "IRE", "Arabic"],
    class: "P5",
    status: "active",
    joinDate: "2017",
    qualification: "Islamic Studies Certificate",
  },
  {
    id: 6,
    name: "Ustazah Khadija Omar",
    email: "khadija@alheb.edu",
    phone: "+256 700 234 572",
    subjects: ["Mathematics", "Science", "Kiswahili"],
    class: "P6",
    status: "active",
    joinDate: "2022",
    qualification: "Diploma in Primary Education",
  },
  {
    id: 7,
    name: "Ustaz Yusuf Ssemanda",
    email: "yusuf@alheb.edu",
    phone: "+256 700 234 573",
    subjects: ["English", "Social Studies", "Science"],
    class: "P7",
    status: "active",
    joinDate: "2016",
    qualification: "Bachelor of Education",
  },
  {
    id: 8,
    name: "Sheikh Abdul-Rahman",
    email: "abdulrahman@alheb.edu",
    phone: "+256 700 234 574",
    subjects: ["Quran", "Arabic", "IRE"],
    class: "All Classes",
    status: "active",
    joinDate: "2015",
    qualification: "Ijazah in Quran",
  },
];

const Teachers = () => {
  return (
    <DashboardLayout title="Teachers" subtitle="Manage teaching staff - Uganda New Curriculum">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">{teachers.length} teachers</p>
          <p className="text-xs text-muted-foreground">NCDC Certified Educators</p>
        </div>
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
                <p className="text-sm text-muted-foreground">{teacher.class} Class Teacher</p>
                <Badge variant="default" className="mt-2">
                  {teacher.status}
                </Badge>
              </div>
            </div>

            {/* Qualification */}
            <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">{teacher.qualification}</p>
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

            {/* Learning Areas */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <BookOpen className="h-3 w-3" />
                <span>Learning Areas</span>
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
