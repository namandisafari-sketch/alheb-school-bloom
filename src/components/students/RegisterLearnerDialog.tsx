import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClasses } from "@/hooks/useClasses";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  // Learner fields
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  gender: z.enum(["male", "female"], { required_error: "Please select gender" }),
  date_of_birth: z.string().optional(),
  class_id: z.string().optional(),
  district: z.string().trim().max(100).optional(),
  religion: z.string().trim().max(50).optional(),
  // Guardian fields
  guardian_name: z.string().trim().min(2, "Guardian name is required").max(100, "Name must be less than 100 characters"),
  guardian_phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number is too long"),
  guardian_email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  guardian_relationship: z.string().trim().max(50).optional(),
  // Parent account fields
  create_parent_account: z.boolean().default(true),
  parent_password: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine((data) => {
  if (data.create_parent_account && !data.parent_password) {
    return false;
  }
  return true;
}, {
  message: "Password is required when creating parent account",
  path: ["parent_password"],
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterLearnerDialogProps {
  children: React.ReactNode;
}

export function RegisterLearnerDialog({ children }: RegisterLearnerDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: classes = [] } = useClasses();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      gender: undefined,
      date_of_birth: "",
      class_id: "",
      district: "",
      religion: "Islam",
      guardian_name: "",
      guardian_phone: "",
      guardian_email: "",
      guardian_relationship: "parent",
      create_parent_account: true,
      parent_password: "",
    },
  });

  const createParentAccount = form.watch("create_parent_account");

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      let parentUserId: string | null = null;

      // Create parent account if requested
      if (values.create_parent_account && values.guardian_email && values.parent_password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.guardian_email,
          password: values.parent_password,
          options: {
            data: {
              full_name: values.guardian_name,
              phone: values.guardian_phone,
            },
          },
        });

        if (authError) {
          if (authError.message.includes("already registered")) {
            throw new Error("This email is already registered. Use a different email or uncheck 'Create parent account'.");
          }
          throw authError;
        }

        parentUserId = authData.user?.id || null;

        // Update the profile with phone number
        if (parentUserId) {
          await supabase
            .from("profiles")
            .update({ phone: values.guardian_phone })
            .eq("id", parentUserId);
        }
      }

      // Create guardian record
      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .insert({
          full_name: values.guardian_name,
          phone: values.guardian_phone,
          email: values.guardian_email || null,
          relationship: values.guardian_relationship || "parent",
        })
        .select("id")
        .single();

      if (guardianError) throw guardianError;

      // Create learner with guardian_id
      const { data: learner, error: learnerError } = await supabase.from("learners").insert({
        full_name: values.full_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth || null,
        class_id: values.class_id || null,
        district: values.district || null,
        religion: values.religion || "Islam",
        guardian_id: guardian.id,
      }).select("id").single();

      if (learnerError) throw learnerError;

      // Link parent account to learner if created
      if (parentUserId && learner) {
        const { error: linkError } = await supabase.from("parent_learner_links").insert({
          parent_user_id: parentUserId,
          learner_id: learner.id,
          relationship: values.guardian_relationship || "parent",
        });

        if (linkError) {
          console.error("Failed to link parent:", linkError);
        }
      }

      return { parentUserId, guardianEmail: values.guardian_email };
    },
    onSuccess: (data) => {
      if (data.parentUserId) {
        toast({ 
          title: "Learner Registered", 
          description: `Learner registered and parent account created for ${data.guardianEmail}` 
        });
      } else {
        toast({ title: "Success", description: "Learner registered successfully" });
      }
      queryClient.invalidateQueries({ queryKey: ["learners"] });
      queryClient.invalidateQueries({ queryKey: ["parent-links"] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register learner",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Learner</DialogTitle>
          <DialogDescription>
            Enter the learner's details and guardian information. A parent account will be created automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Learner Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Learner Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Kampala" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select religion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Islam">Islam</SelectItem>
                          <SelectItem value="Christianity">Christianity</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Guardian / Parent Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guardian_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter guardian name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardian_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+256 700 123 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardian_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email {createParentAccount && "*"}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="guardian@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardian_relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Parent Account Section */}
            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <FormField
                control={form.control}
                name="create_parent_account"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Create parent portal account
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Allow the guardian to login and track their child's progress
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {createParentAccount && (
                <FormField
                  control={form.control}
                  name="parent_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Min 6 characters" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Share this password with the parent. They can login using their email.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Learner
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
