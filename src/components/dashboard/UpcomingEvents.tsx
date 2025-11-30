import { Calendar, Clock } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Jummah Prayer Assembly",
    date: "Today",
    time: "12:30 PM",
    type: "religious",
  },
  {
    id: 2,
    title: "P7 PLE Mock Examinations",
    date: "Dec 5, 2024",
    time: "8:00 AM",
    type: "exam",
  },
  {
    id: 3,
    title: "Quran Competition",
    date: "Dec 10, 2024",
    time: "9:00 AM",
    type: "event",
  },
  {
    id: 4,
    title: "End of Term 3 Exams",
    date: "Dec 15, 2024",
    time: "8:00 AM",
    type: "exam",
  },
  {
    id: 5,
    title: "Term 3 Closes",
    date: "Dec 20, 2024",
    time: "All Day",
    type: "holiday",
  },
];

export const UpcomingEvents = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
      <h3 className="font-display text-lg font-semibold text-card-foreground">
        Upcoming Events
      </h3>
      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-card-foreground truncate">{event.title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{event.date}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
