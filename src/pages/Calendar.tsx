import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCalendar, useUpsertCalendarEvent, useDeleteCalendarEvent, CalendarEvent } from "@/hooks/useCalendar";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Settings2,
  Trash2,
  Pencil,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const eventSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  event_type: z.enum(['term', 'holiday', 'exam', 'activity', 'event']),
  color: z.string(),
});

const Calendar = () => {
  const { data: events = [], isLoading } = useCalendar();
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "head_teacher";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const upsertEvent = useUpsertCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(), "yyyy-MM-dd"),
      event_type: "event",
      color: "#3b82f6",
    }
  });

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      await upsertEvent.mutateAsync({
        id: editingEvent?.id,
        ...values,
      });
      toast({ title: "Success", description: "Calendar event saved." });
      setIsDialogOpen(false);
      form.reset();
      setEditingEvent(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description || "",
      start_date: event.start_date,
      end_date: event.end_date,
      event_type: event.event_type,
      color: event.color,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent.mutateAsync(id);
      toast({ title: "Deleted", description: "Event removed from calendar." });
    }
  };

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const start = parseISO(event.start_date);
      const end = parseISO(event.end_date);
      return isWithinInterval(day, { start, end });
    });
  };

  const typeColors = {
    term: "bg-blue-500",
    holiday: "bg-emerald-500",
    exam: "bg-amber-500",
    activity: "bg-purple-500",
    event: "bg-slate-500",
  };

  return (
    <DashboardLayout title="School Calendar" subtitle="Terms, holidays and academic events">
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Main Calendar View */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-y bg-muted/30">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-[120px]">
                {/* Empty cells for previous month padding */}
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="border-r border-b bg-muted/5 opacity-50" />
                ))}
                
                {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div key={day.toString()} className={cn(
                      "border-r border-b p-2 relative group hover:bg-muted/10 transition-colors",
                      isToday && "bg-primary/5"
                    )}>
                      <span className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full mb-1",
                        isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}>
                        {format(day, "d")}
                      </span>
                      <div className="space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map(event => (
                          <div 
                            key={event.id}
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-sm text-white truncate font-medium",
                              typeColors[event.event_type]
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[9px] text-muted-foreground font-bold pl-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Feed */}
          <div className="grid gap-4 md:grid-cols-2">
            {events.filter(e => parseISO(e.start_date) >= new Date()).slice(0, 4).map(event => (
              <Card key={event.id} className="group relative overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-1.5 h-full", typeColors[event.event_type])} />
                <CardContent className="p-4 flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-2 min-w-[60px] h-fit">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{format(parseISO(event.start_date), "MMM")}</span>
                    <span className="text-xl font-black">{format(parseISO(event.start_date), "dd")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] uppercase mb-1">{event.event_type}</Badge>
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(event)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-sm truncate">{event.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{event.description || "No details provided"}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(parseISO(event.start_date), "EEE")} - {format(parseISO(event.end_date), "EEE, dd MMM")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingEvent(null);
                form.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 shadow-lg hover:shadow-primary/20 transition-all">
                  <Plus className="mr-2 h-5 w-5" /> Add Program Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Program Item" : "New Program Item"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl><Input placeholder="e.g. End of Term Three" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="event_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="term">Academic Term</SelectItem>
                              <SelectItem value="holiday">School Holiday</SelectItem>
                              <SelectItem value="exam">Examination Period</SelectItem>
                              <SelectItem value="activity">Co-curricular Activity</SelectItem>
                              <SelectItem value="event">General Event</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Details (Optional)</FormLabel>
                          <FormControl><Textarea placeholder="More information..." className="resize-none" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={upsertEvent.isPending}>
                      {upsertEvent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingEvent ? "Update Item" : "Add to Calendar"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          <Card className="border-none shadow-lg bg-primary/5">
            <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><AlertCircle className="h-4 w-4 text-primary" /> Note</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Academic terms and holidays are set by the school administration. 
              The dates here are final and should be used for planning by both staff and parents.
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Categories</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className={cn("h-3 w-3 rounded-full", color)} />
                  <span className="text-xs capitalize font-medium">{type}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
