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
import { useAuth } from "@/hooks/useAuth";
import { SecurityDashboard } from "@/components/dashboard/SecurityDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { InventorySummaryWidget } from "@/components/dashboard/InventoryWidgets";
import { SystemHealthWidget } from "@/components/dashboard/SystemHealthWidget";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, Shield, Activity, Package, Monitor } from "lucide-react";

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
  const { role } = useAuth();
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

  if (role === "security") {
    return (
      <DashboardLayout 
        title="Gate Operations" 
        subtitle="Security & Visitor Management - Alheib Mixed Day & Boarding School"
      >
        <SecurityDashboard />
      </DashboardLayout>
    );
  }

  if (role === "teacher") {
    return (
      <DashboardLayout 
        title="Teacher Workspace" 
        subtitle="Manage your classes and learner progress"
      >
        <TeacherDashboard />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Term 3, 2024 - Alheib Mixed Day & Boarding School"
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

      {/* Main Content Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* Left Stats Column (Small Widgets) */}
        <div className="space-y-6">
          <SystemHealthWidget />
          <InventorySummaryWidget />
          <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Progress</h4>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
             </div>
             <div>
                <p className="text-2xl font-black text-slate-900">78%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Syllabus Completion</p>
             </div>
             <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 w-[78%]" />
             </div>
          </div>
        </div>

        {/* Center Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <FeeCollectionSummary />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClassOverview />
            <RecentFeePayments />
          </div>
          <RecentActivity />
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          <QuickActions />
          <OutstandingBalancesWidget />
          <UpcomingEvents />
          
          <Card className="border-2 border-slate-100 shadow-sm p-5 bg-blue-50/30">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                   <Monitor className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase text-blue-900">Remote Access</h4>
                   <p className="text-[10px] font-bold text-blue-500">VPN Tunnel Active</p>
                </div>
             </div>
             <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest">
                Configure Gateway
             </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
