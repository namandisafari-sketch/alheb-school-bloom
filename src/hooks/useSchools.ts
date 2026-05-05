
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface School {
  id: string;
  name: string;
  district_id: string | null;
  address: string | null;
}

export const useSchools = () => {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as School[];
    },
  });
};

export const useCreateSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (school: Partial<School>) => {
      const { data, error } = await supabase.from("schools").insert(school).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schools"] }),
  });
};
