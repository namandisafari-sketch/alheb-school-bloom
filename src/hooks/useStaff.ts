import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StaffRole = "admin" | "teacher" | "support" | "driver" | "security" | "cook" | "cleaner" | "accountant";

export interface Staff {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  qualification: string | null;
  role: StaffRole | string | null;
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
  return useQuery({
    queryKey: ["staff", roleFilter],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*").order("full_name");

      if (roleFilter && roleFilter !== "all" && roleFilter !== "teacher") {
        query = query.eq("role", roleFilter);
      } else if (roleFilter === "all") {
        // Get all non-teacher staff
        query = query.neq("role", "teacher");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Staff[];
    },
  });
};

export const useAllStaff = () => {
  return useQuery({
    queryKey: ["all-staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (error) throw error;
      return data as Staff[];
    },
  });
};
