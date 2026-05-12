import { StatCard } from "./StatCard";
import { ClassOverview } from "./ClassOverview";
import { RecentActivity } from "./RecentActivity";
import { UpcomingEvents } from "./UpcomingEvents";
import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import { useLearners } from "@/hooks/useLearners";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";

export const HeadTeacherDashboard = () => {
  const { data: learners } = useLearners();
  const { data: teachers } = useTeachers();
  const { data: classes } = useClasses();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Learners" value={learners?.length ?? 0} change="School-wide" changeType="neutral" icon={Users} iconColor="primary" delay={0} />
        <StatCard title="Teachers" value={teachers?.length ?? 0} change="Active" changeType="neutral" icon={GraduationCap} iconColor="secondary" delay={100} />
        <StatCard title="Classes" value={classes?.length ?? 0} change="P1-P7" changeType="neutral" icon={BookOpen} iconColor="success" delay={200} />
        <StatCard title="Discipline Cases" value="—" change="This term" changeType="neutral" icon={ClipboardCheck} iconColor="info" delay={300} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ClassOverview />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};
