import { useState, useRef } from "react";
import { format, formatDistanceToNow, isToday, isPast } from "date-fns";
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
  LogIn, LogOut, Plus, Search, Phone, MapPin, Clock, AlertTriangle, Printer, Ban,
} from "lucide-react";
import {
  useVisitors, useCreateVisitor, useVisitorVisits, useCheckInVisitor, useCheckOutVisitor,
  type Visitor, type VisitorVisit,
} from "@/hooks/useVisitors";
import {
  useReentrySlips, useIssueReentrySlip, useVoidReentrySlip, type ReentrySlip,
} from "@/hooks/useReentrySlips";
import { useAppointments } from "@/hooks/useAppointments";
import { useAllStaff } from "@/hooks/useStaff";
import { useLearners } from "@/hooks/useLearners";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmergencyReentrySlip } from "@/components/idcards/EmergencyReentrySlip";
import { toast } from "@/hooks/use-toast";

const Visitors = () => {
  const { data: activeVisits = [] } = useVisitorVisits("active");
  const { data: allVisits = [] } = useVisitorVisits("all");
  const { data: visitors = [] } = useVisitors();
  const { data: appointments = [] } = useAppointments();
  const { data: slips = [] } = useReentrySlips();

  const todayApptsScheduled = appointments.filter(
    (a) => isToday(new Date(a.scheduled_for)) && a.status === "scheduled"
  );

  const activeSlips = slips.filter((s) => !s.voided && !isPast(new Date(s.expires_at))).length;

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
          <TabsTrigger value="reentry">
            Re-entry Slips
            {activeSlips > 0 && <Badge variant="secondary" className="ml-2">{activeSlips}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="log">Visit Log</TabsTrigger>
          <TabsTrigger value="visitors">Recurring Visitors</TabsTrigger>
        </TabsList>

        {/* GATE DESK */}
        <TabsContent value="gate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <StatTile label="Currently on-site" value={activeVisits.length} />
            <StatTile label="Today's appointments" value={appointments.filter(a => isToday(new Date(a.scheduled_for))).length} />
            <StatTile label="Active re-entry slips" value={activeSlips} />
            <StatTile label="Recurring visitors" value={visitors.filter(v => v.is_recurring).length} />
          </div>

          <Card>
            <CardHeader className="flex-row justify-between items-center gap-2 flex-wrap">
              <div>
                <CardTitle className="text-base">Today's Scheduled Appointments</CardTitle>
                <CardDescription>One-click check-in for booked visitors</CardDescription>
              </div>
              <div className="flex gap-2">
                <ReentrySlipDialog
                  trigger={
                    <Button variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />Issue Re-entry Slip
                    </Button>
                  }
                />
                <CheckInDialog trigger={<Button><Plus className="h-4 w-4 mr-2" />Walk-in Check-In</Button>} />
              </div>
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

        {/* RE-ENTRY SLIPS LOG */}
        <TabsContent value="reentry" className="space-y-4">
          <Card>
            <CardHeader className="flex-row justify-between items-center gap-2 flex-wrap">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Emergency Re-entry Slips
                </CardTitle>
                <CardDescription>
                  Time-limited thermal passes for visitors returning after checkout
                </CardDescription>
              </div>
              <ReentrySlipDialog
                trigger={
                  <Button>
                    <Printer className="h-4 w-4 mr-2" />Issue New Slip
                  </Button>
                }
              />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {slips.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No re-entry slips issued yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Host / Purpose</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Width</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slips.map((s) => <ReentrySlipRow key={s.id} slip={s} />)}
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
                    <TableHead className="text-right">Action</TableHead>
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
                      <TableCell className="text-right">
                        {v.status === "checked_out" && (
                          <ReentrySlipDialog
                            visit={v}
                            trigger={
                              <Button size="sm" variant="outline">
                                <AlertTriangle className="h-3 w-3 mr-1" />Re-entry
                              </Button>
                            }
                          />
                        )}
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

const ReentrySlipRow = ({ slip }: { slip: ReentrySlip }) => {
  const voidSlip = useVoidReentrySlip();
  const expired = isPast(new Date(slip.expires_at));
  const status = slip.voided
    ? { label: "Voided", cls: "bg-muted text-muted-foreground" }
    : expired
      ? { label: "Expired", cls: "bg-destructive text-destructive-foreground" }
      : { label: "Active", cls: "bg-green-600 text-white" };

  return (
    <TableRow>
      <TableCell><span className="font-mono text-xs">{slip.serial}</span></TableCell>
      <TableCell>
        <div className="font-medium">{slip.visitor_name}</div>
        {slip.visitor_phone && <div className="text-xs text-muted-foreground">{slip.visitor_phone}</div>}
      </TableCell>
      <TableCell className="text-sm">
        {slip.host_name && <div>{slip.host_name}</div>}
        {slip.purpose && <div className="text-xs text-muted-foreground line-clamp-1">{slip.purpose}</div>}
      </TableCell>
      <TableCell className="text-xs">{format(new Date(slip.issued_at), "dd MMM HH:mm")}</TableCell>
      <TableCell className="text-xs">
        {format(new Date(slip.expires_at), "dd MMM HH:mm")}
        <div className="text-muted-foreground">{slip.duration_minutes} min</div>
      </TableCell>
      <TableCell className="text-xs">{slip.print_width}mm</TableCell>
      <TableCell><Badge className={status.cls}>{status.label}</Badge></TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <ReprintSlipButton slip={slip} />
          {!slip.voided && !expired && (
            <Button size="sm" variant="ghost" onClick={() => voidSlip.mutate(slip.id)}>
              <Ban className="h-3 w-3" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

const ReprintSlipButton = ({ slip }: { slip: ReentrySlip }) => {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const schoolName = settings?.landing_hero?.school_name || "Al-Heb School";

  const remainingMin = Math.max(
    0,
    Math.round((new Date(slip.expires_at).getTime() - Date.now()) / 60000),
  );

  const handlePrint = () => {
    if (!ref.current) return;
    const w = window.open("", "_blank", "width=400,height=700");
    if (!w) return;
    w.document.write(`<html><head><title>${slip.serial}</title>
      <style>body{margin:0;padding:8px;font-family:monospace;}</style>
    </head><body>${ref.current.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost"><Printer className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reprint Re-entry Slip</DialogTitle>
          <DialogDescription>Serial {slip.serial}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center bg-muted/30 p-4 rounded">
          <div ref={ref}>
            <EmergencyReentrySlip
              schoolName={schoolName}
              visitorName={slip.visitor_name}
              visitorPhone={slip.visitor_phone}
              idNumber={slip.id_number}
              purpose={slip.purpose}
              host={slip.host_name}
              durationMinutes={remainingMin > 0 ? remainingMin : slip.duration_minutes}
              width={slip.print_width as 54 | 80}
              isRTL={language === "ar"}
              badgeNumber={slip.badge_number}
              originalVisitId={slip.original_visit_id}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReentrySlipDialog = ({
  visit,
  trigger,
}: {
  visit?: VisitorVisit;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const issue = useIssueReentrySlip();
  const { data: settings } = useSiteSettings();
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [issued, setIssued] = useState<ReentrySlip | null>(null);
  const schoolName = settings?.school_name || "Al-Heb School";

  const [form, setForm] = useState({
    visitor_name: visit?.visitor_name || "",
    visitor_phone: visit?.visitor_phone || "",
    id_number: "",
    purpose: visit?.purpose || "",
    host_name: visit?.host_name || "",
    duration_minutes: 60,
    print_width: 80 as 54 | 80,
    notes: "",
  });

  const submit = async () => {
    if (!form.visitor_name.trim()) {
      toast({ title: "Visitor name required", variant: "destructive" });
      return;
    }
    try {
      const slip = await issue.mutateAsync({
        visitor_name: form.visitor_name.trim(),
        visitor_phone: form.visitor_phone.trim() || null,
        id_number: form.id_number.trim() || null,
        purpose: form.purpose.trim() || null,
        host_name: form.host_name.trim() || null,
        duration_minutes: form.duration_minutes,
        print_width: form.print_width,
        original_visit_id: visit?.id || null,
        visitor_id: visit?.visitor_id || null,
        notes: form.notes.trim() || null,
      });
      setIssued(slip);
      toast({ title: "Slip issued", description: `Serial ${slip.serial}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handlePrint = () => {
    if (!ref.current) return;
    const w = window.open("", "_blank", "width=400,height=700");
    if (!w) return;
    w.document.write(`<html><head><title>${issued?.serial}</title>
      <style>body{margin:0;padding:8px;font-family:monospace;}</style>
    </head><body>${ref.current.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 250);
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => setIssued(null), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Emergency Re-entry Slip
          </DialogTitle>
          <DialogDescription>
            Time-limited thermal pass for a visitor returning after checkout.
          </DialogDescription>
        </DialogHeader>

        {!issued ? (
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>National ID No.</Label>
                <Input value={form.id_number} onChange={(e) => setForm({ ...form, id_number: e.target.value })} maxLength={40} />
              </div>
              <div className="space-y-1.5">
                <Label>Host</Label>
                <Input value={form.host_name} onChange={(e) => setForm({ ...form, host_name: e.target.value })} maxLength={120} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Purpose</Label>
              <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Select value={String(form.duration_minutes)} onValueChange={(v) => setForm({ ...form, duration_minutes: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Print Width</Label>
                <Select value={String(form.print_width)} onValueChange={(v) => setForm({ ...form, print_width: Number(v) as 54 | 80 })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="54">54mm thermal</SelectItem>
                    <SelectItem value="80">80mm thermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center bg-muted/30 p-4 rounded">
            <div ref={ref}>
              <EmergencyReentrySlip
                schoolName={schoolName}
                visitorName={issued.visitor_name}
                visitorPhone={issued.visitor_phone}
                idNumber={issued.id_number}
                purpose={issued.purpose}
                host={issued.host_name}
                durationMinutes={issued.duration_minutes}
                width={issued.print_width as 54 | 80}
                isRTL={language === "ar"}
                badgeNumber={issued.badge_number}
                originalVisitId={issued.original_visit_id}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={close}>Close</Button>
          {!issued ? (
            <Button onClick={submit} disabled={issue.isPending}>
              <Printer className="h-4 w-4 mr-2" />Issue Slip
            </Button>
          ) : (
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />Print
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
