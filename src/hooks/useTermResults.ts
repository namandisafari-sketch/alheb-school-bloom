import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type CompetencyLevel = Database["public"]["Enums"]["competency_level"];
type TermType = Database["public"]["Enums"]["term_type"];

export interface TermResult {
  id: string;
  learner_id: string;
  subject_id: string;
  class_id: string;
  term: TermType;
  academic_year: number;
  score: number | null;
  competency_rating: CompetencyLevel;
  teacher_remarks: string | null;
  recorded_by: string | null;
  learner_name?: string;
  subject_name?: string;
}

export interface TermResultInput {
  learner_id: string;
  subject_id: string;
  class_id: string;
  term: TermType;
  academic_year: number;
  score: number | null;
  competency_rating: CompetencyLevel;
  teacher_remarks?: string | null;
}

export const useTermResults = (classId?: string, term?: TermType, academicYear?: number) => {
  return useQuery({
    queryKey: ["term-results", classId, term, academicYear],
    queryFn: async () => {
      let query = supabase.from("term_results").select("*");
      
      if (classId) query = query.eq("class_id", classId);
      if (term) query = query.eq("term", term);
      if (academicYear) query = query.eq("academic_year", academicYear);

      const { data, error } = await query;
      if (error) throw error;

      // Get learner and subject names
      const { data: learners } = await supabase.from("learners").select("id, full_name");
      const { data: subjects } = await supabase.from("subjects").select("id, name");

      const learnerMap = new Map(learners?.map((l) => [l.id, l.full_name]) || []);
      const subjectMap = new Map(subjects?.map((s) => [s.id, s.name]) || []);

      return data.map((result) => ({
        ...result,
        learner_name: learnerMap.get(result.learner_id),
        subject_name: subjectMap.get(result.subject_id),
      })) as TermResult[];
    },
    enabled: !!classId,
  });
};

export const useSubjects = (classLevel?: number) => {
  return useQuery({
    queryKey: ["subjects", classLevel],
    queryFn: async () => {
      let query = supabase.from("subjects").select("*").order("name");
      
      if (classLevel) {
        query = query
          .lte("min_class_level", classLevel)
          .gte("max_class_level", classLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useSaveTermResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (results: TermResultInput[]) => {
      const { data: user } = await supabase.auth.getUser();
      
      const resultsWithRecorder = results.map((r) => ({
        ...r,
        recorded_by: user.user?.id,
      }));

      const { data, error } = await supabase
        .from("term_results")
        .upsert(resultsWithRecorder, {
          onConflict: "learner_id,subject_id,class_id,term,academic_year",
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["term-results"] });
    },
  });
};
