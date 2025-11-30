import { UserPlus, BookOpen, Award, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "enrollment",
    message: "New learner Ahmed Hassan enrolled in P3",
    time: "5 minutes ago",
    icon: UserPlus,
    color: "text-success bg-success/10",
  },
  {
    id: 2,
    type: "class",
    message: "P7 PLE preparation classes started",
    time: "1 hour ago",
    icon: BookOpen,
    color: "text-info bg-info/10",
  },
  {
    id: 3,
    type: "achievement",
    message: "Fatima Ali completed Juz Amma memorization",
    time: "2 hours ago",
    icon: Award,
    color: "text-warning bg-warning/10",
  },
  {
    id: 4,
    type: "announcement",
    message: "Term 3 examinations scheduled for December",
    time: "3 hours ago",
    icon: Bell,
    color: "text-primary bg-primary/10",
  },
];

export const RecentActivity = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <h3 className="font-display text-lg font-semibold text-card-foreground">
        Recent Activity
      </h3>
      <div className="mt-4 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={cn("rounded-lg p-2", activity.color)}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{activity.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
