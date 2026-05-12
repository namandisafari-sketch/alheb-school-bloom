import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Bell, Send, Clock, CheckCircle, XCircle, FileText, History, Inbox, Info, AlertTriangle, Users, Search, MessageSquare, ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useBroadcastNotification, useInAppNotifications, useMarkNotificationRead } from "@/hooks/useInAppNotifications";
import { toast } from "@/hooks/use-toast";
import { UserActions } from "@/components/users/UserActions";

const Notifications = () => {
  const broadcast = useBroadcastNotification();
  const { data: myNotifs = [] } = useInAppNotifications();
  const markRead = useMarkNotificationRead();

  const [form, setForm] = useState({
    title: "", message: "", type: "info" as "info" | "success" | "warning" | "error",
    audience: "all" as "all" | "admins" | "teachers" | "staff", link: "",
  });

  // Direct messaging state
  const [dmSearch, setDmSearch] = useState("");
  const [dmRoleFilter, setDmRoleFilter] = useState<string>("all");
  const [dmRecipient, setDmRecipient] = useState<any | null>(null);
  const [dmTitle, setDmTitle] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [dmType, setDmType] = useState<"info" | "success" | "warning" | "error">("info");

  const { data: directoryUsers = [] } = useQuery({
    queryKey: ["notif-directory-users"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone").order("full_name");
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const map = new Map((roles || []).map((r: any) => [r.user_id, r.role]));
      return (profiles || []).map((p: any) => ({ ...p, role: map.get(p.id) }));
    },
  });

  const sendDirect = async () => {
    if (!dmRecipient) {
      toast({ title: "Pick a recipient", variant: "destructive" });
      return;
    }
    if (!dmTitle.trim() || !dmMessage.trim()) {
      toast({ title: "Title and message required", variant: "destructive" });
      return;
    }
    try {
      await broadcast.mutateAsync({
        title: dmTitle.trim(),
        message: dmMessage.trim(),
        type: dmType,
        audience: "user_ids" as any,
        user_ids: [dmRecipient.id],
      });
      toast({ title: "Message sent", description: `Delivered to ${dmRecipient.full_name}` });
      setDmTitle(""); setDmMessage("");
    } catch (e: any) {
      toast({ title: "Send failed", description: e.message, variant: "destructive" });
    }
  };

  const filteredDirectory = directoryUsers.filter((u: any) => {
    if (dmRoleFilter !== "all" && u.role !== dmRoleFilter) return false;
    const q = dmSearch.toLowerCase().trim();
    if (!q) return true;
    return (u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["notification-templates"],
    queryFn: async () => {
      const { data } = await supabase.from("notification_templates").select("*").order("name");
      return data || [];
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["notification-logs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notification_logs").select("*").order("created_at", { ascending: false }).limit(100);
      return data || [];
    },
  });

  const send = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast({ title: "Title and message required", variant: "destructive" });
      return;
    }
    try {
      const count = await broadcast.mutateAsync({
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        audience: form.audience,
        link: form.link.trim() || undefined,
      });
      toast({ title: "Notification sent", description: `Delivered to ${count} user(s)` });
      setForm({ ...form, title: "", message: "", link: "" });
    } catch (e: any) {
      toast({ title: "Send failed", description: e.message, variant: "destructive" });
    }
  };

  const unread = myNotifs.filter((n) => !n.is_read).length;

  return (
    <DashboardLayout title="Notifications" subtitle="In-app inbox, broadcasts, templates and history">
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">
            <Inbox className="h-4 w-4 mr-2" />Inbox{unread > 0 && <Badge variant="secondary" className="ml-2">{unread}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="compose"><Send className="h-4 w-4 mr-2" />Broadcast</TabsTrigger>
          <TabsTrigger value="direct"><MessageSquare className="h-4 w-4 mr-2" />Direct Message</TabsTrigger>
          <TabsTrigger value="templates"><FileText className="h-4 w-4 mr-2" />Templates</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" />SMS/WA Log</TabsTrigger>
        </TabsList>

        {/* INBOX */}
        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Inbox</CardTitle>
              <CardDescription>{myNotifs.length} message(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {myNotifs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>You're all caught up</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myNotifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => !n.is_read && markRead.mutate(n.id)}
                      className={`w-full text-left rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors ${
                        !n.is_read ? "bg-primary/5 border-primary/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <TypeIcon type={n.type} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={!n.is_read ? "font-semibold" : "font-medium"}>{n.title}</p>
                            <span className="text-xs text-muted-foreground">{format(new Date(n.created_at), "dd MMM HH:mm")}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                          {n.link && <p className="text-xs text-primary mt-1">{n.link}</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BROADCAST */}
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Broadcast In-App Notification</CardTitle>
              <CardDescription>Sends instantly to selected audience's inbox</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Audience</Label>
                  <Select value={form.audience} onValueChange={(v: any) => setForm({ ...form, audience: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      <SelectItem value="admins">Admins only</SelectItem>
                      <SelectItem value="teachers">Teachers only</SelectItem>
                      <SelectItem value="staff">Staff only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} />
              </div>
              <div className="space-y-1.5">
                <Label>Message *</Label>
                <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={500} />
              </div>
              <div className="space-y-1.5">
                <Label>Link (optional)</Label>
                <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/fees" maxLength={200} />
              </div>
              <div className="flex justify-end">
                <Button onClick={send} disabled={broadcast.isPending}>
                  <Send className="h-4 w-4 mr-2" />Send Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DIRECT MESSAGE */}
        <TabsContent value="direct">
          <div className="grid lg:grid-cols-5 gap-4">
            {/* User directory */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />User Directory</CardTitle>
                    <CardDescription>{filteredDirectory.length} of {directoryUsers.length}</CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/users"><ExternalLink className="h-3 w-3 mr-1" />Manage</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8 h-9" placeholder="Search users..." value={dmSearch} onChange={(e) => setDmSearch(e.target.value)} />
                  </div>
                  <Select value={dmRoleFilter} onValueChange={setDmRoleFilter}>
                    <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="head_teacher">Head Teacher</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-1">
                  {filteredDirectory.map((u: any) => (
                    <div
                      key={u.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                        dmRecipient?.id === u.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <button onClick={() => setDmRecipient(u)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                          {(u.full_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{u.full_name || "Unnamed"}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                        {u.role && <Badge variant="outline" className="text-[9px] capitalize">{u.role.replace("_", " ")}</Badge>}
                      </button>
                      <UserActions user={u} />
                    </div>
                  ))}
                  {filteredDirectory.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">No users found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Compose direct */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {dmRecipient ? `Message ${dmRecipient.full_name}` : "Send a Direct Message"}
                </CardTitle>
                <CardDescription>
                  {dmRecipient ? `Delivers to ${dmRecipient.email || "user inbox"}` : "Pick a user from the directory"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dmRecipient && (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {(dmRecipient.full_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{dmRecipient.full_name}</p>
                        <p className="text-xs text-muted-foreground">{dmRecipient.email} · {dmRecipient.phone || "No phone"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{dmRecipient.role || "no role"}</Badge>
                      <UserActions user={dmRecipient} />
                    </div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={dmType} onValueChange={(v: any) => setDmType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Title *</Label>
                    <Input value={dmTitle} onChange={(e) => setDmTitle(e.target.value)} maxLength={120} placeholder="Subject" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Message *</Label>
                  <Textarea rows={6} value={dmMessage} onChange={(e) => setDmMessage(e.target.value)} maxLength={500} placeholder="Write your message..." />
                </div>
                <div className="flex justify-end">
                  <Button onClick={sendDirect} disabled={broadcast.isPending || !dmRecipient}>
                    <Send className="h-4 w-4 mr-2" />Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message Templates</CardTitle>
              <CardDescription>Pre-defined SMS/WhatsApp templates (used when external messaging is enabled)</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No templates yet</p>
              ) : (
                <div className="space-y-2">
                  {templates.map((t: any) => (
                    <div key={t.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{t.name}</p>
                        <Badge variant="outline">{t.channel}</Badge>
                        {!t.is_active && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
                      <p className="text-xs font-mono bg-muted px-2 py-1 rounded mt-2">{t.message_body.slice(0, 200)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history">
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>SMS / WhatsApp pending integration</AlertTitle>
            <AlertDescription>
              External SMS/WhatsApp dispatch requires Twilio or WhatsApp credentials. In-app notifications are fully active above.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader><CardTitle className="text-base">External Message Log</CardTitle></CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No external messages yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead><TableHead>Channel</TableHead>
                      <TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((l: any) => (
                      <TableRow key={l.id}>
                        <TableCell><div className="font-medium">{l.recipient_name || "—"}</div><div className="text-xs text-muted-foreground">{l.recipient_phone}</div></TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{l.channel}</Badge></TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{l.message_content}</TableCell>
                        <TableCell><StatusBadge status={l.status} /></TableCell>
                        <TableCell className="text-xs">{format(new Date(l.created_at), "dd MMM HH:mm")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

const TypeIcon = ({ type }: { type: string }) => {
  const map: any = {
    info: <Info className="h-5 w-5 text-primary mt-0.5" />,
    success: <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />,
    error: <XCircle className="h-5 w-5 text-destructive mt-0.5" />,
  };
  return map[type] || map.info;
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "delivered": return <Badge className="bg-green-600">Delivered</Badge>;
    case "sent": return <Badge className="bg-blue-600">Sent</Badge>;
    case "failed": return <Badge variant="destructive">Failed</Badge>;
    case "pending": return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default Notifications;
