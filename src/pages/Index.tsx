import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ClassOverview } from "@/components/dashboard/ClassOverview";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Term 3, 2024 - Alheb Islamic Primary School"
    >
      {/* Term Banner */}
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-primary">Uganda New Curriculum</p>
            <p className="text-sm text-muted-foreground">P1-P7 Competency-Based Education System</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Term 3, 2024</p>
            <p className="text-xs text-muted-foreground">Week 8 of 14</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Learners"
          value={210}
          change="+15 this term"
          changeType="positive"
          icon={Users}
          iconColor="primary"
          delay={0}
        />
        <StatCard
          title="Teachers"
          value={8}
          change="NCDC Certified"
          changeType="neutral"
          icon={GraduationCap}
          iconColor="secondary"
          delay={100}
        />
        <StatCard
          title="Classes (P1-P7)"
          value={7}
          change="All active"
          changeType="neutral"
          icon={BookOpen}
          iconColor="success"
          delay={200}
        />
        <StatCard
          title="Attendance Rate"
          value="92%"
          change="+3% from last week"
          changeType="positive"
          icon={ClipboardCheck}
          iconColor="info"
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ClassOverview />
          <RecentActivity />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <UpcomingEvents />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
