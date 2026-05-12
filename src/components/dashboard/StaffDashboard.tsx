import { StatCard } from "./StatCard";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { InventorySummaryWidget } from "./InventoryWidgets";
import { Package, Users, ClipboardList, Bell } from "lucide-react";
import { useLearners } from "@/hooks/useLearners";

export const StaffDashboard = () => {
  const { data: learners } = useLearners();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Learners" value={learners?.length ?? 0} change="Registered" changeType="neutral" icon={Users} iconColor="primary" delay={0} />
        <StatCard title="Open Tasks" value="—" change="Assigned to you" changeType="neutral" icon={ClipboardList} iconColor="info" delay={100} />
        <StatCard title="Inventory Alerts" value="—" change="Low stock" changeType="neutral" icon={Package} iconColor="warning" delay={200} />
        <StatCard title="Notifications" value="—" change="Unread" changeType="neutral" icon={Bell} iconColor="secondary" delay={300} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <InventorySummaryWidget />
        </div>
      </div>
    </div>
  );
};
