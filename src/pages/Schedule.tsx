import { useState } from "react";
import { format, startOfDay, endOfDay, addDays, isSameDay } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Plus, Clock, MapPin, User, Phone, Edit2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment, type Appointment,
} from "@/hooks/useAppointments";
import { useAllStaff } from "@/hooks/useStaff";
import { useLearners } from "@/hooks/useLearners";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const from = startOfDay(selectedDate).toISOString();
  const to = endOfDay(addDays(selectedDate, 30)).toISOString();
  const { data: appointments = [], isLoading } = useAppointments({ from: startOfDay(selectedDate).toISOString(), to });

  const todayAppts = appointments.filter((a) => isSameDay(new Date(a.scheduled_for), selectedDate));
  const upcoming = appointments.filter((a) => new Date(a.scheduled_for) > endOfDay(selectedDate));

  // Scheduled broadcasts
  const { data: scheduledNotifs = [] } = useQuery({
    queryKey: ["scheduled-notifications-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("scheduled_notifications")
        .select("id, scheduled_for, target_audience, status, notification_templates(name, subject)")
        .order("scheduled_for", { ascending: true })
        .limit(50);
      return data || [];
    },
  });

  return (
    <DashboardLayout title="Schedule" subtitle="Appointments, events and scheduled notifications">
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="notifications">Scheduled Notifications</TabsTrigger>
        </TabsList>

        {/* APPOINTMENTS */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-lg font-semibold">Appointments</h3>
              <p className="text-sm text-muted-foreground">
                Manage visitor appointments scheduled by reception
              </p>
            </div>
            <AppointmentDialog />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Today" value={todayAppts.length} />
            <StatTile label="Upcoming" value={upcoming.length} />
            <StatTile label="Scheduled" value={appointments.filter(a => a.status === "scheduled").length} />
            <StatTile label="Completed" value={appointments.filter(a => a.status === "completed").length} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Appointments</CardTitle>
              <CardDescription>From {format(selectedDate, "PPP")} onward</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground">No appointments scheduled</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((a) => (
                      <AppointmentRow key={a.id} appt={a} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CALENDAR */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  className="pointer-events-auto"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">{format(selectedDate, "EEEE, dd MMMM yyyy")}</CardTitle>
                <CardDescription>{todayAppts.length} appointment(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {todayAppts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nothing scheduled</p>
                ) : (
                  todayAppts.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <span className="text-xs font-bold">{format(new Date(a.scheduled_for), "HH:mm")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{a.visitor_name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{a.purpose}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                          {a.host_name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{a.host_name}</span>}
                          {a.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.location}</span>}
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.duration_minutes}m</span>
                        </div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SCHEDULED NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scheduled Notifications</CardTitle>
              <CardDescription>Broadcasts queued to be sent later</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledNotifs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No scheduled notifications</p>
              ) : (
                <div className="space-y-2">
                  {scheduledNotifs.map((s: any) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {s.notification_templates?.subject || s.notification_templates?.name || "Notification"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(s.scheduled_for), "PPP HH:mm")} · {s.target_audience}
                        </p>
                      </div>
                      <Badge variant="outline">{s.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

const StatTile = ({ label, value }: { label: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: Appointment["status"] }) => {
  const map: Record<Appointment["status"], { label: string; className: string }> = {
    scheduled: { label: "Scheduled", className: "bg-blue-500" },
    checked_in: { label: "Checked In", className: "bg-amber-500" },
    completed: { label: "Completed", className: "bg-green-600" },
    cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
    no_show: { label: "No-show", className: "bg-destructive" },
  };
  const v = map[status];
  return <Badge className={v.className}>{v.label}</Badge>;
};

const AppointmentRow = ({ appt }: { appt: Appointment }) => {
  const update = useUpdateAppointment();
  const del = useDeleteAppointment();
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{format(new Date(appt.scheduled_for), "dd MMM yyyy")}</div>
        <div className="text-xs text-muted-foreground">{format(new Date(appt.scheduled_for), "HH:mm")} · {appt.duration_minutes}m</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{appt.visitor_name}</div>
        {appt.visitor_phone && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />{appt.visitor_phone}
          </div>
        )}
      </TableCell>
      <TableCell className="max-w-[220px]"><span className="line-clamp-2 text-sm">{appt.purpose}</span></TableCell>
      <TableCell className="text-sm">{appt.host_name || "—"}</TableCell>
      <TableCell className="text-sm">{appt.location || "—"}</TableCell>
      <TableCell><StatusBadge status={appt.status} /></TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {appt.status === "scheduled" && (
            <Button size="sm" variant="ghost" onClick={() => update.mutate({ id: appt.id, status: "cancelled" })}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <AppointmentDialog existing={appt} trigger={
            <Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" /></Button>
          } />
          <Button size="sm" variant="ghost" onClick={() => {
            if (confirm("Delete this appointment?")) del.mutate(appt.id);
          }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const AppointmentDialog = ({
  existing,
  trigger,
}: {
  existing?: Appointment;
  trigger?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const create = useCreateAppointment();
  const update = useUpdateAppointment();
  const { data: staff = [] } = useAllStaff();
  const { data: learners = [] } = useLearners();

  const [form, setForm] = useState({
    visitor_name: existing?.visitor_name || "",
    visitor_phone: existing?.visitor_phone || "",
    purpose: existing?.purpose || "",
    date: existing ? format(new Date(existing.scheduled_for), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    time: existing ? format(new Date(existing.scheduled_for), "HH:mm") : "09:00",
    duration_minutes: existing?.duration_minutes || 30,
    location: existing?.location || "",
    host_staff_id: existing?.host_staff_id || "",
    learner_id: existing?.learner_id || "",
    notes: existing?.notes || "",
    reminder_enabled: existing?.reminder_enabled ?? true,
  });

  const submit = async () => {
    if (!form.visitor_name.trim() || !form.purpose.trim()) {
      toast({ title: "Missing fields", description: "Visitor name and purpose are required", variant: "destructive" });
      return;
    }
    const scheduled_for = new Date(`${form.date}T${form.time}:00`).toISOString();
    const host = staff.find((s) => s.id === form.host_staff_id);
    const payload = {
      visitor_id: null,
      visitor_name: form.visitor_name.trim(),
      visitor_phone: form.visitor_phone.trim() || null,
      purpose: form.purpose.trim(),
      scheduled_for,
      duration_minutes: Number(form.duration_minutes) || 30,
      location: form.location.trim() || null,
      host_staff_id: form.host_staff_id || null,
      host_name: host?.full_name || null,
      learner_id: form.learner_id || null,
      notes: form.notes.trim() || null,
      reminder_enabled: form.reminder_enabled,
    };

    try {
      if (existing) {
        await update.mutateAsync({ id: existing.id, ...payload });
        toast({ title: "Appointment updated" });
      } else {
        await create.mutateAsync(payload);
        toast({ title: "Appointment scheduled" });
      }
      setOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button><Plus className="h-4 w-4 mr-2" />New Appointment</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit" : "Schedule"} Appointment</DialogTitle>
          <DialogDescription>For visitors meeting staff or about a learner</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Visitor Name *</Label>
              <Input value={form.visitor_name} onChange={(e) => setForm({ ...form, visitor_name: e.target.value })} maxLength={120} />
            </div>
            <div className="space-y-1.5">
              <Label>Visitor Phone</Label>
              <Input value={form.visitor_phone} onChange={(e) => setForm({ ...form, visitor_phone: e.target.value })} maxLength={30} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Purpose *</Label>
            <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Discuss learner progress" maxLength={200} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.date ? format(new Date(form.date), "PPP") : "Pick"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(form.date)}
                    onSelect={(d) => d && setForm({ ...form, date: format(d, "yyyy-MM-dd") })}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Time *</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Duration (min)</Label>
              <Input type="number" min={5} max={480} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Location / Room</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Reception, Room 5" maxLength={80} />
            </div>
            <div className="space-y-1.5">
              <Label>Host Staff</Label>
              <Select value={form.host_staff_id} onValueChange={(v) => setForm({ ...form, host_staff_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select host" /></SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.role})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Linked Learner (optional)</Label>
            <Select value={form.learner_id} onValueChange={(v) => setForm({ ...form, learner_id: v })}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {learners.slice(0, 200).map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.full_name} {l.admission_number ? `· ${l.admission_number}` : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} maxLength={500} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.reminder_enabled}
              onChange={(e) => setForm({ ...form, reminder_enabled: e.target.checked })}
            />
            Send a reminder before the appointment
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={create.isPending || update.isPending}>
            {existing ? "Save changes" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Schedule;
