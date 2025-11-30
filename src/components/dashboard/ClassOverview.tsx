import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const classes = [
  { name: "Primary 1 (P1)", students: 32, capacity: 40, teacher: "Ustaz Ibrahim" },
  { name: "Primary 2 (P2)", students: 35, capacity: 40, teacher: "Ustazah Amina" },
  { name: "Primary 3 (P3)", students: 38, capacity: 40, teacher: "Ustaz Ahmed" },
  { name: "Primary 4 (P4)", students: 30, capacity: 40, teacher: "Ustazah Fatima" },
  { name: "Primary 5 (P5)", students: 28, capacity: 40, teacher: "Ustaz Mohamed" },
  { name: "Primary 6 (P6)", students: 25, capacity: 40, teacher: "Ustazah Khadija" },
  { name: "Primary 7 (P7)", students: 22, capacity: 40, teacher: "Ustaz Yusuf" },
];

export const ClassOverview = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-card-foreground">
            Class Overview
          </h3>
          <p className="text-xs text-muted-foreground">Uganda New Curriculum Structure</p>
        </div>
        <span className="text-sm text-muted-foreground">
          {classes.length} Classes
        </span>
      </div>
      <div className="mt-4 space-y-4">
        {classes.map((cls) => (
          <div key={cls.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{cls.name}</span>
                <span className="text-xs text-muted-foreground">({cls.teacher})</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {cls.students}/{cls.capacity}
              </div>
            </div>
            <Progress value={(cls.students / cls.capacity) * 100} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
