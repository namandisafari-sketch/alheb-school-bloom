import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePharmacy = () => {
  return useQuery({
    queryKey: ["pharmacy-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pharmacy_items")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useHealthVisits = () => {
  return useQuery({
    queryKey: ["health-visits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_visits")
        .select(`
          *,
          learner:learners(full_name, admission_number),
          staff:profiles!health_visits_staff_id_fkey(full_name),
          recorder:profiles!health_visits_recorded_by_fkey(full_name)
        `)
        .order("visit_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateHealthVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (visit: any) => {
      const { data, error } = await supabase
        .from("health_visits")
        .insert(visit)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-visits"] });
    },
  });
};

export const useUpdatePharmacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: any) => {
      const { data, error } = await supabase
        .from("pharmacy_items")
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-items"] });
    },
  });
};
