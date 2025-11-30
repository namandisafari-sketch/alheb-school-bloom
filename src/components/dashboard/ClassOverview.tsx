import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const classes = [
  { name: "Grade 1", students: 28, capacity: 30, teacher: "Ustaz Ibrahim" },
  { name: "Grade 2", students: 25, capacity: 30, teacher: "Ustazah Amina" },
  { name: "Grade 3", students: 30, capacity: 30, teacher: "Ustaz Ahmed" },
  { name: "Grade 4", students: 22, capacity: 30, teacher: "Ustazah Fatima" },
  { name: "Grade 5", students: 27, capacity: 30, teacher: "Ustaz Mohamed" },
];

export const ClassOverview = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-card-foreground">
          Class Overview
        </h3>
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
