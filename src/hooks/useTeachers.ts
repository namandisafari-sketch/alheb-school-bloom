import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("role", "teacher")
        .order("full_name");

      if (error) throw error;
      return data;
    },
  });
};
