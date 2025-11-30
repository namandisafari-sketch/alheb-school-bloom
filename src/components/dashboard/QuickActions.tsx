import { UserPlus, FileText, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: UserPlus, label: "Add Student", variant: "default" as const },
  { icon: FileText, label: "Generate Report", variant: "outline" as const },
  { icon: Calendar, label: "Schedule Event", variant: "outline" as const },
  { icon: MessageSquare, label: "Send Notice", variant: "outline" as const },
];

export const QuickActions = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <h3 className="font-display text-lg font-semibold text-card-foreground">
        Quick Actions
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto flex-col gap-2 py-4"
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
