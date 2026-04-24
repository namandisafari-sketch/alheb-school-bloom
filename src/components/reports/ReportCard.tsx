import { Learner } from "@/hooks/useLearners";
import { TermResult, Subject, ReportCardRow } from "@/hooks/useTermResults";
import { Database } from "@/integrations/supabase/types";
import { ReportCardIslamic } from "./ReportCardIslamic";
import { ReportCardSecular } from "./ReportCardSecular";

type TermType = Database["public"]["Enums"]["term_type"];

interface ReportCardProps {
  learner: Learner;
  results: TermResult[];
  subjects: Subject[];
  className: string;
  classLevel?: number;
  term: TermType;
  academicYear: number;
  teacherName?: string;
  meta?: ReportCardRow | null;
}

/**
 * Picks the correct report-card template based on the learner's religion.
 * - Muslim learners → ReportCardIslamic (Bismillah header, green/gold, Islamic section first, Sheikh signatory)
 * - Everyone else  → ReportCardSecular (blue/red accents, academics only, no Islamic block)
 */
export const ReportCard = (props: ReportCardProps) => {
  const religion = (props.learner.religion || "").toLowerCase();
  const isMuslim = religion.includes("islam") || religion.includes("muslim");
  return isMuslim ? <ReportCardIslamic {...props} /> : <ReportCardSecular {...props} />;
};
