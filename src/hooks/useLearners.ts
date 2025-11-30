import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Learner {
  id: string;
  full_name: string;
  gender: "male" | "female";
  date_of_birth: string | null;
  district: string | null;
  status: string | null;
  admission_number: string | null;
  enrollment_date: string | null;
  class_id: string | null;
  guardian_id: string | null;
  photo_url: string | null;
  religion: string | null;
  class_name?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  classes?: { name: string } | null;
  guardian?: { full_name: string; phone: string } | null;
}

export const useLearners = () => {
  return useQuery({
    queryKey: ["learners"],
    queryFn: async () => {
      const { data: learners, error: learnersError } = await supabase
        .from("learners")
        .select("*")
        .order("full_name");

      if (learnersError) throw learnersError;

      // Fetch classes and guardians for joining
      const { data: classes } = await supabase.from("classes").select("id, name");
      const { data: guardians } = await supabase.from("guardians").select("id, full_name, phone");

      const classMap = new Map(classes?.map((c) => [c.id, c.name]) || []);
      const guardianMap = new Map(
        guardians?.map((g) => [g.id, { name: g.full_name, phone: g.phone }]) || []
      );

      return learners.map((learner) => ({
        ...learner,
        class_name: learner.class_id ? classMap.get(learner.class_id) : null,
        guardian_name: learner.guardian_id ? guardianMap.get(learner.guardian_id)?.name : null,
        guardian_phone: learner.guardian_id ? guardianMap.get(learner.guardian_id)?.phone : null,
      })) as Learner[];
    },
  });
};
