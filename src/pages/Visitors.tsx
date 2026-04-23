import { useState } from "react";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LogIn, LogOut, Users, Plus, Search, Phone, MapPin, Clock,
} from "lucide-react";
import {
  useVisitors, useCreateVisitor, useVisitorVisits, useCheckInVisitor, useCheckOutVisitor,
  type Visitor, type VisitorVisit,
} from "@/hooks/useVisitors";
import { useAppointments } from "@/hooks/useAppointments";
import { useAllStaff } from "@/hooks/useStaff";
import { useLearners } from "@/hooks/useLearners";
import { toast } from "@/hooks/use-toast";

const Visitors = () => {
  const { data: activeVisits = [] } = useVisitorVisits("active");
  const { data: allVisits = [] } = useVisitorVisits("all");
  const { data: visitors = [] } = useVisitors();
  const { data: appointments = [] } = useAppointments();

  const todayApptsScheduled = appointments.filter(
    (a) => isToday(new Date(a.scheduled_for)) && a.status === "scheduled"
  );

  return (
    <DashboardLayout title="Visitors" subtitle="Gate check-in / check-out and visitor records">
      <Tabs defaultValue="gate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gate">Gate Desk</TabsTrigger>
          <TabsTrigger value="active">
            On-Site
            {activeVisits.length > 0 && (
              <Badge variant="secondary" className="ml-2">{activeVisits.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="log">Visit Log</TabsTrigger>
          <TabsTrigger value="visitors">Recurring Visitors</TabsTrigger>
        </TabsList>

        {/* GATE DESK */}
        <TabsContent value="gate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatTile label="Currently on-site" value={activeVisits.length} />
            <StatTile label="Today's appointments" value={appointments.filter(a => isToday(new Date(a.scheduled_for))).length} />
            <StatTile label="Recurring visitors" value={visitors.filter(v => v.is_recurring).length} />
          </div>

          <Card>
            <CardHeader className="flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base">Today's Scheduled Appointments</CardTitle>
                <CardDescription>One-click check-in for booked visitors</CardDescription>
              </div>
              <CheckInDialog trigger={<Button><Plus className="h-4 w-4 mr-2" />Walk-in Check-In</Button>} />
            </CardHeader>
            <CardContent>
              {todayApptsScheduled.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No more scheduled appointments today</p>
              ) : (
                <div className="space-y-2">
                  {todayApptsScheduled.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/30">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <span className="text-xs font-bold">{format(new Date(a.scheduled_for), "HH:mm")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{a.visitor_name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{a.purpose}</p>
                        <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-muted-foreground">
                          {a.host_name && <span>👤 {a.host_name}</span>}
                          {a.location && <span><MapPin className="inline h-3 w-3" /> {a.location}</span>}
                          {a.visitor_phone && <span><Phone className="inline h-3 w-3" /> {a.visitor_phone}</span>}
                        </div>
                      </div>
                      <CheckInDialog
                        appointment={a}
                        trigger={<Button size="sm"><LogIn className="h-4 w-4 mr-2" />Check In</Button>}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVE / ON-SITE */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visitors Currently On-Site</CardTitle>
              <CardDescription>{activeVisits.length} active</CardDescription>
            </CardHeader>
            <CardContent>
              {activeVisits.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No visitors on-site</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Checked In</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeVisits.map((v) => <ActiveVisitRow key={v.id} visit={v} />)}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOG */}
        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visit Log</CardTitle>
              <CardDescription>Most recent 200 visits</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allVisits.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <div className="font-medium">{v.visitor_name}</div>
                        {v.visitor_phone && <div className="text-xs text-muted-foreground">{v.visitor_phone}</div>}
                      </TableCell>
                      <TableCell><span className="font-mono text-xs">{v.badge_number}</span></TableCell>
                      <TableCell className="max-w-[200px]"><span className="line-clamp-2 text-sm">{v.purpose || "—"}</span></TableCell>
                      <TableCell className="text-sm">{v.host_name || "—"}</TableCell>
                      <TableCell className="text-sm">{format(new Date(v.check_in_at), "dd MMM HH:mm")}</TableCell>
                      <TableCell className="text-sm">{v.check_out_at ? format(new Date(v.check_out_at), "dd MMM HH:mm") : "—"}</TableCell>
                      <TableCell>
                        <Badge className={v.status === "checked_in" ? "bg-amber-500" : "bg-green-600"}>
                          {v.status === "checked_in" ? "On-site" : "Departed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VISITORS DIRECTORY */}
        <TabsContent value="visitors" className="space-y-4">
          <RecurringVisitors visitors={visitors} />
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

const ActiveVisitRow = ({ visit }: { visit: VisitorVisit }) => {
  const checkOut = useCheckOutVisitor();
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{visit.visitor_name}</div>
        {visit.visitor_phone && <div className="text-xs text-muted-foreground">{visit.visitor_phone}</div>}
      </TableCell>
      <TableCell><span className="font-mono text-xs">{visit.badge_number}</span></TableCell>
      <TableCell className="text-sm max-w-[200px]"><span className="line-clamp-2">{visit.purpose || "—"}</span></TableCell>
      <TableCell className="text-sm">{visit.host_name || "—"}</TableCell>
      <TableCell className="text-sm">
        <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(visit.check_in_at), { addSuffix: true })}</div>
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="outline" onClick={() => checkOut.mutate(visit)}>
          <LogOut className="h-4 w-4 mr-2" />Check Out
        </Button>
      </TableCell>
    </TableRow>
  );
};

const RecurringVisitors = ({ visitors }: { visitors: Visitor[] }) => {
  const [search, setSearch] = useState("");
  const filtered = visitors.filter((v) => v.full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle className="text-base">Visitor Directory</CardTitle>
          <CardDescription>Reusable visitor records (contractors, vendors, etc.)</CardDescription>
        </div>
        <NewVisitorDialog />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search…" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No visitors yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quick Check-In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.full_name}</TableCell>
                  <TableCell className="text-sm">{v.phone || "—"}</TableCell>
                  <TableCell className="text-sm">{v.company || "—"}</TableCell>
                  <TableCell className="text-sm font-mono">{v.id_number || "—"}</TableCell>
                  <TableCell>
                    {v.is_recurring ? <Badge variant="secondary">Recurring</Badge> : <Badge variant="outline">One-time</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <CheckInDialog
                      visitor={v}
                      trigger={<Button size="sm" variant="outline"><LogIn className="h-4 w-4 mr-2" />Check In</Button>}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const NewVisitorDialog = () => {
  const [open, setOpen] = useState(false);
  const create = useCreateVisitor();
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", company: "", id_number: "", notes: "", is_recurring: true,
  });

  const submit = async () => {
    if (!form.full_name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      await create.mutateAsync({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        company: form.company.trim() || null,
        id_number: form.id_number.trim() || null,
        photo_url: null,
        notes: form.notes.trim() || null,
        is_recurring: form.is_recurring,
      });
      toast({ title: "Visitor saved" });
      setOpen(false);
      setForm({ full_name: "", phone: "", email: "", company: "", id_number: "", notes: "", is_recurring: true });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Add Visitor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Visitor</DialogTitle>
          <DialogDescription>Reusable record for recurring visitors</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="space-y-1.5">
            <Label>Full Name *</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={120} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={120} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={120} />
            </div>
            <div className="space-y-1.5">
              <Label>National ID No.</Label>
              <Input value={form.id_number} onChange={(e) => setForm({ ...form, id_number: e.target.value })} maxLength={40} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} />
            Recurring visitor (vendor, contractor, etc.)
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CheckInDialog = ({
  appointment,
  visitor,
  trigger,
}: {
  appointment?: any;
  visitor?: Visitor;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const checkIn = useCheckInVisitor();
  const { data: staff = [] } = useAllStaff();
  const { data: learners = [] } = useLearners();

  const [form, setForm] = useState({
    visitor_name: appointment?.visitor_name || visitor?.full_name || "",
    visitor_phone: appointment?.visitor_phone || visitor?.phone || "",
    purpose: appointment?.purpose || "",
    host_staff_id: appointment?.host_staff_id || "",
    learner_id: appointment?.learner_id || "",
    notes: "",
  });

  const submit = async () => {
    if (!form.visitor_name.trim()) {
      toast({ title: "Visitor name required", variant: "destructive" });
      return;
    }
    const host = staff.find((s) => s.id === form.host_staff_id);
    try {
      await checkIn.mutateAsync({
        visitor_id: visitor?.id || null,
        appointment_id: appointment?.id || null,
        visitor_name: form.visitor_name.trim(),
        visitor_phone: form.visitor_phone.trim() || null,
        visitor_photo_url: visitor?.photo_url || null,
        purpose: form.purpose.trim() || null,
        host_staff_id: form.host_staff_id || null,
        host_name: host?.full_name || appointment?.host_name || null,
        learner_id: form.learner_id || null,
        notes: form.notes.trim() || null,
      });
      toast({ title: "Visitor checked in", description: "Day pass issued" });
      setOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In Visitor</DialogTitle>
          <DialogDescription>
            {appointment ? "From scheduled appointment" : visitor ? "Recurring visitor" : "Walk-in visitor"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Visitor Name *</Label>
              <Input value={form.visitor_name} onChange={(e) => setForm({ ...form, visitor_name: e.target.value })} maxLength={120} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.visitor_phone} onChange={(e) => setForm({ ...form, visitor_phone: e.target.value })} maxLength={30} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Purpose</Label>
            <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} maxLength={200} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Host Staff</Label>
              <Select value={form.host_staff_id} onValueChange={(v) => setForm({ ...form, host_staff_id: v })}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Linked Learner</Label>
              <Select value={form.learner_id} onValueChange={(v) => setForm({ ...form, learner_id: v })}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {learners.slice(0, 200).map((l) => <SelectItem key={l.id} value={l.id}>{l.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={checkIn.isPending}>
            <LogIn className="h-4 w-4 mr-2" />Check In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Visitors;
