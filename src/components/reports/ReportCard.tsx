import { Learner } from "@/hooks/useLearners";
import { TermResult } from "@/hooks/useTermResults";
import { Database } from "@/integrations/supabase/types";
import { useLanguage } from "@/contexts/LanguageContext";

type TermType = Database["public"]["Enums"]["term_type"];

interface Subject {
  id: string;
  name: string;
  code: string | null;
  is_core: boolean | null;
}

interface ReportCardProps {
  learner: Learner;
  results: TermResult[];
  subjects: Subject[];
  className: string;
  term: TermType;
  academicYear: number;
  teacherName: string;
}

const competencyLabels: Record<string, { en: string; ar: string }> = {
  beginning: { en: "Beginning", ar: "مبتدئ" },
  approaching: { en: "Approaching", ar: "يقترب" },
  meeting: { en: "Meeting", ar: "يلبي التوقعات" },
  exceeding: { en: "Exceeding", ar: "يتجاوز التوقعات" },
};

const competencyShort: Record<string, string> = {
  beginning: "BE",
  approaching: "AE",
  meeting: "ME",
  exceeding: "EE",
};

const termLabels: Record<TermType, { en: string; ar: string }> = {
  term_1: { en: "TERM ONE", ar: "الفصل الأول" },
  term_2: { en: "TERM TWO", ar: "الفصل الثاني" },
  term_3: { en: "TERM THREE", ar: "الفصل الثالث" },
};

export const ReportCard = ({
  learner,
  results,
  subjects,
  className,
  term,
  academicYear,
  teacherName,
}: ReportCardProps) => {
  const { language, isRTL } = useLanguage();

  const getResultForSubject = (subjectId: string) => {
    return results.find((r) => r.subject_id === subjectId);
  };

  const calculateOverallCompetency = () => {
    if (results.length === 0) return "N/A";
    const competencyValues: Record<string, number> = { beginning: 1, approaching: 2, meeting: 3, exceeding: 4 };
    const avg =
      results.reduce((sum, r) => sum + (competencyValues[r.competency_rating] || 0), 0) /
      results.length;
    if (avg >= 3.5) return "exceeding";
    if (avg >= 2.5) return "meeting";
    if (avg >= 1.5) return "approaching";
    return "beginning";
  };

  const labels = {
    schoolName: { en: "ALHEB ISLAMIC PRIMARY SCHOOL", ar: "مدرسة الهب الإسلامية الابتدائية" },
    motto: { en: "Education with Islamic Values", ar: "التعليم بالقيم الإسلامية" },
    reportCard: { en: "REPORT CARD", ar: "بطاقة التقرير" },
    name: { en: "Name:", ar: "الاسم:" },
    class: { en: "Class:", ar: "الفصل:" },
    admissionNo: { en: "Admission No:", ar: "رقم القبول:" },
    gender: { en: "Gender:", ar: "الجنس:" },
    male: { en: "Male", ar: "ذكر" },
    female: { en: "Female", ar: "أنثى" },
    competencyKey: { 
      en: "Competency Key: BE = Beginning | AE = Approaching Expectation | ME = Meeting Expectation | EE = Exceeding Expectation",
      ar: "مفتاح الكفاءة: BE = مبتدئ | AE = يقترب من التوقعات | ME = يلبي التوقعات | EE = يتجاوز التوقعات"
    },
    subject: { en: "Subject", ar: "المادة" },
    score: { en: "Score (%)", ar: "الدرجة (%)" },
    competency: { en: "Competency", ar: "الكفاءة" },
    teacherRemarks: { en: "Teacher's Remarks", ar: "ملاحظات المعلم" },
    overallCompetency: { en: "Overall Competency:", ar: "الكفاءة العامة:" },
    classTeacherRemarks: { en: "Class Teacher's Remarks:", ar: "ملاحظات معلم الفصل:" },
    headTeacherRemarks: { en: "Head Teacher's Remarks:", ar: "ملاحظات المدير:" },
    classTeacher: { en: "Class Teacher", ar: "معلم الفصل" },
    headTeacher: { en: "Head Teacher", ar: "المدير" },
    parentGuardian: { en: "Parent/Guardian", ar: "ولي الأمر" },
    nextTermBegins: { en: "Next Term Begins:", ar: "بداية الفصل القادم:" },
    schoolFees: { en: "School Fees:", ar: "الرسوم الدراسية:" },
    computerGenerated: { en: "This report is computer generated.", ar: "هذا التقرير مولد آلياً." },
  };

  const t = (key: keyof typeof labels) => labels[key][language];

  return (
    <div className="report-card" dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: isRTL ? "'Cairo', 'Arial', sans-serif" : "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="header">
        <div className="school-name">{t("schoolName")}</div>
        <div className="school-motto">"{t("motto")}"</div>
        <div style={{ fontSize: "10pt", marginTop: "5px" }}>
          P.O. Box 123, Kampala, Uganda | Tel: +256 xxx xxx xxx
        </div>
        <div className="report-title">
          {termLabels[term][language]} {t("reportCard")} - {academicYear}
        </div>
      </div>

      {/* Student Info */}
      <div className="student-info">
        <div className="info-row">
          <span className="info-label">{t("name")}</span>
          <span>{learner.full_name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("class")}</span>
          <span>{className}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("admissionNo")}</span>
          <span>{learner.admission_number || "N/A"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("gender")}</span>
          <span>{learner.gender === "male" ? t("male") : t("female")}</span>
        </div>
      </div>

      {/* Competency Key */}
      <div className="competency-key">
        <strong>{t("competencyKey")}</strong>
      </div>

      {/* Results Table */}
      <table>
        <thead>
          <tr>
            <th style={{ width: "40%", textAlign: isRTL ? "right" : "left" }}>{t("subject")}</th>
            <th style={{ width: "15%", textAlign: "center" }}>{t("score")}</th>
            <th style={{ width: "15%", textAlign: "center" }}>{t("competency")}</th>
            <th style={{ width: "30%", textAlign: isRTL ? "right" : "left" }}>{t("teacherRemarks")}</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => {
            const result = getResultForSubject(subject.id);
            return (
              <tr key={subject.id}>
                <td style={{ textAlign: isRTL ? "right" : "left" }}>{subject.name}</td>
                <td style={{ textAlign: "center" }}>{result?.score ?? "-"}</td>
                <td style={{ textAlign: "center" }}>{result?.competency_rating ? competencyShort[result.competency_rating] : "-"}</td>
                <td style={{ textAlign: isRTL ? "right" : "left" }}>{result?.teacher_remarks || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ marginTop: "10px", fontWeight: "bold" }}>
        {t("overallCompetency")} {competencyShort[calculateOverallCompetency()] || calculateOverallCompetency()} ({competencyLabels[calculateOverallCompetency()]?.[language] || "N/A"})
      </div>

      {/* Remarks Section */}
      <div className="remarks-section">
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>{t("classTeacherRemarks")}</div>
        <div className="remarks-box"></div>
        
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>{t("headTeacherRemarks")}</div>
        <div className="remarks-box"></div>
      </div>

      {/* Signatures */}
      <div className="signature-section">
        <div>
          <div className="signature-line">{t("classTeacher")}</div>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "3px" }}>{teacherName || "_____________"}</div>
        </div>
        <div>
          <div className="signature-line">{t("headTeacher")}</div>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "3px" }}>_____________</div>
        </div>
        <div>
          <div className="signature-line">{t("parentGuardian")}</div>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "3px" }}>{learner.guardian_name || "_____________"}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "9pt", borderTop: "1px solid #000", paddingTop: "10px" }}>
        {t("nextTermBegins")} _____________ | {t("schoolFees")} _____________ | {t("computerGenerated")}
      </div>
    </div>
  );
};
