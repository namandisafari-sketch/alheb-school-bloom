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
import { useDocumentUpload } from "./DocumentUpload";
import { DocumentUpload } from "./DocumentUpload";
import { LocationSelector } from "@/components/common/LocationSelector";

const formSchema = z.object({
  // Learner fields
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  gender: z.enum(["male", "female"], { required_error: "Please select gender" }),
  date_of_birth: z.string().optional(),
  class_id: z.string().optional(),
  district: z.string().trim().max(100).optional(),
  religion: z.string().trim().max(50).optional(),
  nin: z.string().trim().length(14, "NIN must be 14 characters").optional().or(z.literal("")),
  lin: z.string().trim().optional(),
  // Guardian fields
  guardian_name: z.string().trim().min(2, "Guardian name is required").max(100, "Name must be less than 100 characters"),
  guardian_phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number is too long"),
  guardian_email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  guardian_relationship: z.string().trim().max(50).optional(),
  parent_nin: z.string().trim().length(14, "NIN must be 14 characters").optional().or(z.literal("")),
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
  const { documents, setDocuments, uploadAll, isUploading: isUploadingDocs } = useDocumentUpload();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      gender: undefined,
      date_of_birth: "",
      class_id: "",
      district: "",
      religion: "Islam",
      nin: "",
      lin: "",
      guardian_name: "",
      guardian_phone: "",
      guardian_email: "",
      guardian_relationship: "parent",
      parent_nin: "",
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

        // Update the profile with phone number and NIN if provided
        if (parentUserId) {
          await supabase
            .from("profiles")
            .update({ 
              phone: values.guardian_phone,
              nin: values.parent_nin || null
            })
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

      // Create learner with guardian_id and EMIS fields
      const { data: learner, error: learnerError } = await supabase.from("learners").insert({
        full_name: values.full_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth || null,
        class_id: values.class_id || null,
        district: values.district || null,
        religion: values.religion || "Islam",
        nin: values.nin || null,
        lin: values.lin || null,
        parent_nin: values.parent_nin || null,
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

      // Upload documents if any
      if (documents.length > 0 && learner) {
        await uploadAll(learner.id);
      }

      return { parentUserId, guardianEmail: values.guardian_email, learnerId: learner.id };
    },
    onSuccess: (data) => {
      if (data.parentUserId) {
        toast({ 
          title: "Learner Registered", 
          description: `Learner registered and parent account created for ${data.guardianEmail}. EMIS data synced.` 
        });
      } else {
        toast({ title: "Success", description: "Learner registered successfully with EMIS data." });
      }
      queryClient.invalidateQueries({ queryKey: ["learners"] });
      queryClient.invalidateQueries({ queryKey: ["parent-links"] });
      form.reset();
      setDocuments([]);
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
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        form.reset();
        setDocuments([]);
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Learner (EMIS Compliant)</DialogTitle>
          <DialogDescription>
            Enter learner's details, Uganda EMIS data (NIN/LIN), guardian info, and documents.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Learner Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">Learner Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-2">
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Full Name *</FormLabel>
                      <FormControl><Input placeholder="Enter full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Gender *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
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
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {classes.map((cls) => (<SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Religion</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
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

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LocationSelector 
                          districtValue={field.value} 
                          onDistrictChange={field.onChange} 
                          label="Home District (GeoNames)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* EMIS Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <FormField
                  control={form.control}
                  name="nin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Learner NIN (National ID)</FormLabel>
                      <FormControl><Input placeholder="CM123456789ABC" maxLength={14} {...field} className="font-mono" /></FormControl>
                      <p className="text-[10px] text-slate-500">Uganda National Identification Number (14 chars)</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Learner LIN (EMIS Number)</FormLabel>
                      <FormControl><Input placeholder="EMIS/2024/..." {...field} className="font-mono" /></FormControl>
                      <p className="text-[10px] text-slate-500">Learner Identification Number from Ministry</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <div className="h-6 w-1 bg-blue-500 rounded-full" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">Guardian Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guardian_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Guardian Name *</FormLabel>
                      <FormControl><Input placeholder="Enter guardian name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardian_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Phone Number *</FormLabel>
                      <FormControl><Input placeholder="+256 700 123 456" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_nin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Guardian NIN *</FormLabel>
                      <FormControl><Input placeholder="CM123456789ABC" maxLength={14} {...field} className="font-mono" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardian_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="guardian@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Parent Account Section */}
            <div className="space-y-4 rounded-xl border border-dashed bg-muted/30 p-5">
              <FormField
                control={form.control}
                name="create_parent_account"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer font-bold text-sm">Create Parent Portal Account</FormLabel>
                      <p className="text-xs text-muted-foreground">Allow the guardian to login and track child's progress via mobile/web.</p>
                    </div>
                  </FormItem>
                )}
              />

              {createParentAccount && (
                <FormField
                  control={form.control}
                  name="parent_password"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel className="text-xs font-bold uppercase text-slate-500">Account Password *</FormLabel>
                      <FormControl><Input type="password" placeholder="Min 6 characters" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Document Upload Section */}
            <DocumentUpload documents={documents} onDocumentsChange={setDocuments} />

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || isUploadingDocs} className="min-w-[200px] shadow-lg shadow-primary/20">
                {(mutation.isPending || isUploadingDocs) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register & Sync EMIS
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
