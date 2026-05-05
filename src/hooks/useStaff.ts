import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type StaffRole = "admin" | "teacher" | "support" | "driver" | "security" | "cook" | "cleaner" | "accountant";

export interface Staff {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  qualification: string | null;
  role: StaffRole | string | null;
  scope: "global" | "district" | "school" | null;
  district_id: string | null;
  school_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const STAFF_ROLES: { value: StaffRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "teacher", label: "Teacher" },
  { value: "support", label: "Support Staff" },
  { value: "driver", label: "Driver" },
  { value: "security", label: "Security" },
  { value: "cook", label: "Cook" },
  { value: "cleaner", label: "Cleaner" },
  { value: "accountant", label: "Accountant" },
];

export const useStaff = (roleFilter?: StaffRole | "all") => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["staff", roleFilter, profile?.scope, profile?.district_id],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*, user_roles(role)");

      if (profile?.scope === "district" && profile.district_id) {
        query = query.eq("district_id", profile.district_id);
      } else if (profile?.scope === "school" && profile.school_id) {
        query = query.eq("school_id", profile.school_id);
      }

      query = query.order("full_name");

      if (roleFilter && roleFilter !== "all" && roleFilter !== "teacher") {
        query = query.eq("role", roleFilter);
      } else if (roleFilter === "all") {
        // Get all non-teacher staff
        query = query.neq("role", "teacher");
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        role: p.user_roles?.[0]?.role || p.role
      })) as Staff[];
    },
  });
};

export const useAllStaff = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["all-staff", profile?.scope, profile?.district_id],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*, user_roles(role)");

      if (profile?.scope === "district" && profile.district_id) {
        query = query.eq("district_id", profile.district_id);
      } else if (profile?.scope === "school" && profile.school_id) {
        query = query.eq("school_id", profile.school_id);
      }

      const { data, error } = await query.order("full_name");

      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        role: p.user_roles?.[0]?.role || p.role
      })) as Staff[];
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Staff> & { id: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["all-staff"] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["all-staff"] });
    },
  });
};
