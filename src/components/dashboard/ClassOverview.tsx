import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useClasses } from "@/hooks/useClasses";
import { Skeleton } from "@/components/ui/skeleton";

export const ClassOverview = () => {
  const { data: classes, isLoading } = useClasses();

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
          {classes?.length ?? 0} Classes
        </span>
      </div>
      <div className="mt-4 space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : !classes?.length ? (
          <p className="text-sm text-muted-foreground text-center py-4">No classes yet</p>
        ) : (
          classes.map((cls) => {
            const capacity = cls.capacity || 40;
            return (
              <div key={cls.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-card-foreground">{cls.name}</span>
                    {cls.teacher_name && (
                      <span className="text-xs text-muted-foreground">({cls.teacher_name})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {cls.student_count}/{capacity}
                  </div>
                </div>
                <Progress value={(cls.student_count / capacity) * 100} className="h-2" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
