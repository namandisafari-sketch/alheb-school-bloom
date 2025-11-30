import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  UserPlus,
  Search,
  Shield,
  GraduationCap,
  Users,
  HardHat,
  Loader2,
  MoreHorizontal,
  Link as LinkIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLearners } from "@/hooks/useLearners";

type AppRole = "admin" | "teacher" | "parent" | "staff";

const roleConfig: Record<AppRole, { icon: typeof Shield; label: string; color: string }> = {
  admin: { icon: Shield, label: "Administrator", color: "bg-purple-500/10 text-purple-600" },
  teacher: { icon: GraduationCap, label: "Teacher", color: "bg-blue-500/10 text-blue-600" },
  parent: { icon: Users, label: "Parent", color: "bg-green-500/10 text-green-600" },
  staff: { icon: HardHat, label: "Staff", color: "bg-orange-500/10 text-orange-600" },
};

const createUserSchema = z.object({
  fullName: z.string().min(2, "Name required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone required").max(20),
  password: z.string().min(6, "Min 6 characters"),
  role: z.enum(["admin", "teacher", "staff"]),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all users with their roles
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (profilesError) throw profilesError;

      const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);

      return profiles.map((profile) => ({
        ...profile,
        role: roleMap.get(profile.id) as AppRole | undefined,
      }));
    },
  });

  const { data: learners = [] } = useLearners();

  // Fetch parent-learner links
  const { data: parentLinks = [] } = useQuery({
    queryKey: ["parent-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_learner_links")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "teacher",
    },
  });

  // Create staff/admin user mutation
  const createUserMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            phone: values.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Update role (the trigger creates 'parent' by default, we need to update it)
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role: values.role })
        .eq("user_id", authData.user.id);

      if (roleError) throw roleError;

      // Update profile with phone
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ phone: values.phone })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User account created successfully" });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      form.reset();
      setCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Link parent to learner mutation
  const linkParentMutation = useMutation({
    mutationFn: async ({ parentId, learnerId }: { parentId: string; learnerId: string }) => {
      const { error } = await supabase.from("parent_learner_links").insert({
        parent_user_id: parentId,
        learner_id: learnerId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Parent linked to learner" });
      queryClient.invalidateQueries({ queryKey: ["parent-links"] });
      setLinkDialogOpen(false);
      setSelectedParentId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to link parent",
        variant: "destructive",
      });
    },
  });

  const getLinkedLearners = (parentId: string) => {
    const links = parentLinks.filter((l) => l.parent_user_id === parentId);
    return links.map((link) => {
      const learner = learners.find((l) => l.id === link.learner_id);
      return learner?.full_name || "Unknown";
    });
  };

  const onCreateSubmit = (values: CreateUserFormValues) => {
    createUserMutation.mutate(values);
  };

  return (
    <DashboardLayout title="User Management" subtitle="Manage system users and access roles">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["admin", "teacher", "staff", "parent"] as AppRole[]).map((role) => {
          const config = roleConfig[role];
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.color}`}>
                  <config.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}s</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Staff Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Staff/Admin Account</DialogTitle>
              <DialogDescription>
                Create a new account for teachers, staff, or administrators
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@school.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+256 700 123 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Min 6 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="mt-6 rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Linked Learners</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const config = user.role ? roleConfig[user.role] : null;
                const linkedLearners = user.role === "parent" ? getLinkedLearners(user.id) : [];

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${config?.color || "bg-muted"}`}>
                          {user.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {config && (
                        <Badge className={config.color}>{config.label}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>
                      {user.role === "parent" ? (
                        linkedLearners.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {linkedLearners.map((name, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No learners linked</span>
                        )
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === "parent" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedParentId(user.id);
                            setLinkDialogOpen(true);
                          }}
                        >
                          <LinkIcon className="mr-1 h-4 w-4" />
                          Link Learner
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Link Parent Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Parent to Learner</DialogTitle>
            <DialogDescription>
              Select a learner to link to this parent account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              onValueChange={(learnerId) => {
                if (selectedParentId) {
                  linkParentMutation.mutate({ parentId: selectedParentId, learnerId });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select learner" />
              </SelectTrigger>
              <SelectContent>
                {learners.map((learner) => (
                  <SelectItem key={learner.id} value={learner.id}>
                    {learner.full_name} ({learner.class_name || "Unassigned"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
