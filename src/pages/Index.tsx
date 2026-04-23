import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ClassOverview } from "@/components/dashboard/ClassOverview";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { FeeCollectionSummary, RecentFeePayments, OutstandingBalancesWidget } from "@/components/dashboard/FeeWidgets";
import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import { useLearners } from "@/hooks/useLearners";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

const useAttendanceStats = () => {
  return useQuery({
    queryKey: ["attendance-stats"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const weekAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");

      const [todayRes, weekRes] = await Promise.all([
        supabase.from("attendance").select("status").eq("date", today),
        supabase.from("attendance").select("status").gte("date", weekAgo).lt("date", today),
      ]);

      const calc = (rows: { status: string }[] | null) => {
        if (!rows?.length) return null;
        const present = rows.filter((r) => r.status === "present" || r.status === "late").length;
        return Math.round((present / rows.length) * 100);
      };

      const todayRate = calc(todayRes.data);
      const lastWeekRate = calc(weekRes.data);
      return { todayRate, lastWeekRate };
    },
    refetchInterval: 60000,
  });
};

const Index = () => {
  const { data: learners } = useLearners();
  const { data: teachers } = useTeachers();
  const { data: classes } = useClasses();
  const { data: attStats } = useAttendanceStats();

  const totalLearners = learners?.length ?? 0;
  const totalTeachers = teachers?.length ?? 0;
  const totalClasses = classes?.length ?? 0;
  const attendanceRate = attStats?.todayRate;
  const attDelta =
    attStats?.todayRate != null && attStats?.lastWeekRate != null
      ? attStats.todayRate - attStats.lastWeekRate
      : null;

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Term 3, 2024 - Alheb Islamic Primary School"
    >
      {/* Term Banner */}
      <div className="mb-4 lg:mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3 lg:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="font-display text-sm lg:text-base font-semibold text-primary">Uganda New Curriculum</p>
            <p className="text-xs lg:text-sm text-muted-foreground">P1-P7 Competency-Based Education System</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs lg:text-sm font-medium text-foreground">Term 3, 2024</p>
            <p className="text-xs text-muted-foreground">Week 8 of 14</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Learners"
          value={totalLearners}
          change={`${totalLearners} active`}
          changeType="neutral"
          icon={Users}
          iconColor="primary"
          delay={0}
        />
        <StatCard
          title="Teachers"
          value={totalTeachers}
          change={totalTeachers > 0 ? "Active staff" : "No teachers yet"}
          changeType="neutral"
          icon={GraduationCap}
          iconColor="secondary"
          delay={100}
        />
        <StatCard
          title="Classes (P1-P7)"
          value={totalClasses}
          change={totalClasses > 0 ? "All active" : "No classes yet"}
          changeType="neutral"
          icon={BookOpen}
          iconColor="success"
          delay={200}
        />
        <StatCard
          title="Attendance Rate"
          value={attendanceRate != null ? `${attendanceRate}%` : "—"}
          change={
            attDelta != null
              ? `${attDelta >= 0 ? "+" : ""}${attDelta}% from last week`
              : "No data today"
          }
          changeType={attDelta != null ? (attDelta >= 0 ? "positive" : "negative") : "neutral"}
          icon={ClipboardCheck}
          iconColor="info"
          delay={300}
        />
      </div>

      {/* Fee Collection Summary */}
      <div className="mt-4 lg:mt-6">
        <FeeCollectionSummary />
      </div>

      {/* Main Content Grid */}
      <div className="mt-4 lg:mt-6 grid gap-4 lg:gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <ClassOverview />
          <RecentFeePayments />
          <RecentActivity />
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:space-y-6">
          <QuickActions />
          <OutstandingBalancesWidget />
          <UpcomingEvents />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
