import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalendar, useUpsertCalendarEvent, useDeleteCalendarEvent, CalendarEvent } from "@/hooks/useCalendar";
import { Printer, Plus, Calendar as CalendarIcon, Clock, Trash2, Edit2, ChevronLeft, ChevronRight, School, Palmtree, BookOpen, Trophy, PartyPopper, Loader2, Info } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, parseISO, startOfYear, eachMonthOfInterval, endOfYear } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const PRINT_STYLES = `
  @media screen {
    .print-only { display: none !important; }
  }

  @media print {
    body * { visibility: hidden !important; }
    .print-only, .print-only * { visibility: visible !important; }
    
    .print-only {
      display: block !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      background: white !important;
      transform: scale(0.8); /* Stronger shrink to force 1 page */
      transform-origin: top center;
    }

    @page {
      size: A4 landscape;
      margin: 5mm;
    }

    .yearly-grid-print {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 8px !important;
      width: 100% !important;
    }

    .month-mini-print {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      padding: 0px !important;
    }

    /* Compressing the day cells in print */
    .day-cell-print {
      height: 16px !important;
      font-size: 9px !important;
    }

    .notes-print {
      margin-top: 5px !important;
      border-top: 2px solid #000 !important;
      page-break-before: avoid !important;
    }

    .line-print {
      border-bottom: 1px solid #ddd !important;
      height: 15px !important;
    }

    .big-year-print {
      font-size: 60px !important;
      font-weight: 900 !important;
    }
  }
`;

const eventTypeConfig = {
  term: { icon: School, color: "bg-blue-500", label: "School Term" },
  holiday: { icon: Palmtree, color: "bg-emerald-500", label: "Holiday" },
  exam: { icon: BookOpen, color: "bg-purple-500", label: "Examination" },
  activity: { icon: Trophy, color: "bg-orange-500", label: "Co-curricular" },
  event: { icon: PartyPopper, color: "bg-pink-500", label: "Special Event" },
};

const Calendar = () => {
  const { data: events = [], isLoading } = useCalendar();
  const upsertEvent = useUpsertCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "head_teacher";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
    event_type: "event",
    color: "#3b82f6",
    is_public: true,
  });

  const yearStart = startOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: endOfYear(currentDate) });

  const handlePrint = () => { window.print(); };

  const handleSave = async () => {
    try {
      await upsertEvent.mutateAsync({ id: editingEvent?.id, ...formData } as CalendarEvent);
      setIsAddOpen(false);
      setEditingEvent(null);
      toast({ title: "Success", description: "Event saved." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const MonthGrid = ({ month }: { month: Date }) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    const pad = (start.getDay() + 6) % 7;

    return (
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map(d => <div key={d} className="text-[8px] font-black text-slate-400">{d}</div>)}
        {Array.from({ length: pad }).map((_, i) => <div key={i} />)}
        {days.map(day => {
          const hasEvent = events.some(e => isWithinInterval(day, { start: parseISO(e.start_date), end: parseISO(e.end_date) }));
          return (
            <div key={day.toString()} className="text-[10px] h-5 day-cell-print flex items-center justify-center relative font-bold">
              {format(day, "d")}
              {hasEvent && <div className="w-1 h-1 bg-primary rounded-full absolute bottom-0" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout title="School Calendar" subtitle="Full year management">
      <div className="flex gap-4 mb-8 print:hidden">
        <Button variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')} className="rounded-full px-8">Monthly View</Button>
        <Button variant={viewMode === 'year' ? 'default' : 'outline'} onClick={() => setViewMode('year')} className="rounded-full px-8">Yearly Overview</Button>
        <Button variant="outline" className="ml-auto rounded-xl" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Calendar</Button>
      </div>

      <div className="print:hidden">
        {viewMode === 'month' ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            <Card className="border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <CardTitle className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}><ChevronRight className="h-4 w-4" /></Button>
                  {isAdmin && <Button className="ml-2 rounded-lg" onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Event</Button>}
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[600px] overflow-y-auto">
                 {/* Simplified Monthly View for screen */}
                 <div className="p-4">Manage events in the monthly grid here.</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="bg-white p-10 border rounded-3xl shadow-xl">
             <div className="flex justify-between items-end mb-12">
                <h1 className="text-4xl font-black uppercase tracking-tight">Yearly Overview</h1>
                <div className="text-8xl font-black tracking-tighter text-slate-900 leading-none">{format(currentDate, "yyyy")}</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-12">
                {months.map(m => (
                  <div key={m.toString()} className="border-b-2 pb-4">
                    <h3 className="font-black uppercase mb-4">{format(m, "MMMM")}</h3>
                    <MonthGrid month={m} />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* DEDICATED PRINT-ONLY LAYER */}
      <div className="print-only">
        <div className="flex justify-between items-start mb-10 border-b-4 border-black pb-6">
           <div className="flex gap-4 items-center">
             <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
             <div>
               <h1 className="text-2xl font-black uppercase">Alheib Mixed Day & Boarding School</h1>
               <p className="text-sm font-bold text-emerald-700 tracking-widest">OFFICIAL ACADEMIC CALENDAR</p>
             </div>
           </div>
           <div className="text-right">
             <div className="big-year-print leading-none">{format(currentDate, "yyyy")}</div>
             <p className="text-sm font-black uppercase tracking-[0.5em] mt-[-5px]">Calendar</p>
           </div>
        </div>

        <div className="yearly-grid-print">
          {months.map(m => (
            <div key={m.toString()} className="month-mini-print">
              <h3 className="text-sm font-black uppercase border-b-2 border-slate-900 mb-2">{format(m, "MMMM")}</h3>
              <MonthGrid month={m} />
            </div>
          ))}
        </div>

        <div className="notes-print">
           <h3 className="text-lg font-black uppercase mb-2">Notes & Important Dates</h3>
           {Array.from({ length: 5 }).map((_, i) => <div key={i} className="line-print" />)}
        </div>

        <div className="mt-8 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
           <span>Kitikifumba Campus • Academic Year Record</span>
           <span>Official Stamp Area ____________________</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      {/* Save Dialog */}
      {isAdmin && isAddOpen && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
               <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Event Title" />
               <div className="grid grid-cols-2 gap-2">
                 <Input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                 <Input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
               </div>
            </div>
            <DialogFooter><Button onClick={handleSave}>Save Program</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Calendar;
