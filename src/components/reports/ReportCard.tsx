import { Learner } from "@/hooks/useLearners";
import { TermResult, Subject, ReportCardRow } from "@/hooks/useTermResults";
import { Database } from "@/integrations/supabase/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateGrade, computeAggregate, overallRemark } from "@/lib/grading";
import { useIdCardSettings } from "@/hooks/useIdCardSettings";

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
  classLevel,
  term,
  academicYear,
  teacherName,
  meta,
}: ReportCardProps) => {
  const { language, isRTL } = useLanguage();
  const { data: settings } = useIdCardSettings();

  const academicSubjects = subjects.filter((s) => s.category === "academic");
  const islamicSubjects = subjects.filter((s) => s.category === "islamic");

  const getResult = (subjectId: string) =>
    results.find((r) => r.subject_id === subjectId);

  const academicScores = academicSubjects
    .map((s) => getResult(s.id)?.score)
    .filter((v): v is number => v !== null && v !== undefined);
  const { total: acTotal, average: acAvg } = computeAggregate(academicScores);
  const overallGrade = calculateGrade(acAvg, classLevel);

  const labels = {
    motto: { en: "Education with Islamic Values", ar: "التعليم بالقيم الإسلامية" },
    reportCard: { en: "REPORT CARD", ar: "بطاقة التقرير" },
    name: { en: "Name", ar: "الاسم" },
    class: { en: "Class", ar: "الفصل" },
    admNo: { en: "Adm. No", ar: "رقم القبول" },
    gender: { en: "Gender", ar: "الجنس" },
    male: { en: "Male", ar: "ذكر" },
    female: { en: "Female", ar: "أنثى" },
    academicPerf: { en: "Academic Performance", ar: "الأداء الأكاديمي" },
    islamicPerf: { en: "Islamic Studies", ar: "الدراسات الإسلامية" },
    behavior: { en: "Behavior & Development", ar: "السلوك والتطور" },
    attendance: { en: "Attendance Summary", ar: "ملخص الحضور" },
    subject: { en: "Subject", ar: "المادة" },
    score: { en: "Score", ar: "الدرجة" },
    grade: { en: "Grade", ar: "التقدير" },
    remarks: { en: "Remarks", ar: "ملاحظات" },
    total: { en: "Total", ar: "المجموع" },
    average: { en: "Average", ar: "المعدل" },
    position: { en: "Class Position", ar: "ترتيب الفصل" },
    islamicPosition: { en: "Islamic Position", ar: "ترتيب إسلامي" },
    daysPresent: { en: "Days Present", ar: "أيام الحضور" },
    daysAbsent: { en: "Days Absent", ar: "أيام الغياب" },
    attendancePct: { en: "Attendance %", ar: "نسبة الحضور" },
    discipline: { en: "Discipline", ar: "الانضباط" },
    participation: { en: "Participation", ar: "المشاركة" },
    cleanliness: { en: "Cleanliness", ar: "النظافة" },
    classTeacher: { en: "Class Teacher", ar: "معلم الفصل" },
    headTeacher: { en: "Head Teacher", ar: "ناظر المدرسة" },
    director: { en: "Director", ar: "المدير" },
    islamicTeacher: { en: "Islamic Studies Teacher", ar: "معلم الدراسات الإسلامية" },
    parent: { en: "Parent / Guardian", ar: "ولي الأمر" },
    overallRemark: { en: "Overall Remark", ar: "الملاحظة العامة" },
    nextTerm: { en: "Next Term Begins", ar: "بداية الفصل القادم" },
    schoolFees: { en: "School Fees", ar: "الرسوم الدراسية" },
    juzCompleted: { en: "Juz", ar: "جزء" },
  };
  const t = (k: keyof typeof labels) => labels[k][language];

  const schoolName =
    language === "ar"
      ? "مدرسة الهب الإسلامية الابتدائية"
      : "ALHEB ISLAMIC PRIMARY SCHOOL";

  return (
    <div
      className="report-card"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        fontFamily: isRTL
          ? "'Cairo','Arial',sans-serif"
          : "'Inter','Helvetica',sans-serif",
        background: "white",
        color: "#0f172a",
        padding: "24px",
        maxWidth: "210mm",
        margin: "0 auto",
      }}
    >
      {/* Header with school colors (green) */}
      <div
        style={{
          borderBottom: "4px solid #15803d",
          paddingBottom: "12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {settings?.school_logo_url && (
          <img
            src={settings.school_logo_url}
            alt="logo"
            style={{ height: "60px", width: "60px", objectFit: "contain" }}
          />
        )}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: "20pt",
              fontWeight: 800,
              color: "#15803d",
              letterSpacing: "0.5px",
            }}
          >
            {schoolName}
          </div>
          <div style={{ fontStyle: "italic", fontSize: "10pt", color: "#64748b" }}>
            "{labels.motto[language]}"
          </div>
          <div style={{ fontSize: "9pt", marginTop: "4px", color: "#64748b" }}>
            P.O. Box 123, Kampala, Uganda · Tel: +256 xxx xxx xxx
          </div>
          <div
            style={{
              marginTop: "8px",
              fontSize: "13pt",
              fontWeight: 700,
              background: "#15803d",
              color: "white",
              padding: "4px 12px",
              display: "inline-block",
              borderRadius: "4px",
            }}
          >
            {termLabels[term][language]} {labels.reportCard[language]} — {academicYear}
          </div>
        </div>
      </div>

      {/* Section 1: Student info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 16px",
          padding: "10px 12px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "6px",
          fontSize: "11pt",
          marginBottom: "16px",
        }}
      >
        <div>
          <strong>{t("name")}:</strong> {learner.full_name}
        </div>
        <div>
          <strong>{t("class")}:</strong> {className}
        </div>
        <div>
          <strong>{t("admNo")}:</strong> {learner.admission_number || "—"}
        </div>
        <div>
          <strong>{t("gender")}:</strong>{" "}
          {learner.gender === "male" ? t("male") : t("female")}
        </div>
      </div>

      {/* Section 2: Academic Performance */}
      <SectionHeader title={t("academicPerf")} />
      <PerfTable
        subjects={academicSubjects}
        getResult={getResult}
        classLevel={classLevel}
        isRTL={isRTL}
        labels={labels}
        language={language}
        showScore
        showGrade
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "8px",
          padding: "8px 12px",
          background: "#f8fafc",
          borderRadius: "4px",
          fontSize: "10pt",
          fontWeight: 600,
        }}
      >
        <span>
          {t("total")}: <span style={{ color: "#15803d" }}>{acTotal || "—"}</span>
        </span>
        <span>
          {t("average")}:{" "}
          <span style={{ color: "#15803d" }}>{acAvg ? acAvg.toFixed(1) : "—"}</span>%
        </span>
        <span>
          {t("grade")}:{" "}
          <span style={{ color: "#15803d" }}>{overallGrade.grade}</span>
        </span>
        <span>
          {t("position")}:{" "}
          <span style={{ color: "#15803d" }}>
            {meta?.academic_position
              ? `${meta.academic_position} / ${meta.class_size ?? "?"}`
              : "—"}
          </span>
        </span>
      </div>

      {/* Section 3: Islamic Studies (separate) */}
      {islamicSubjects.length > 0 && (
        <>
          <SectionHeader title={t("islamicPerf")} accent="#0e7490" />
          <PerfTable
            subjects={islamicSubjects}
            getResult={getResult}
            classLevel={classLevel}
            isRTL={isRTL}
            labels={labels}
            language={language}
            accent="#0e7490"
          />
          {meta?.islamic_position && (
            <div
              style={{
                marginTop: "8px",
                padding: "6px 12px",
                background: "#ecfeff",
                borderRadius: "4px",
                fontSize: "10pt",
                fontWeight: 600,
              }}
            >
              {t("islamicPosition")}: {meta.islamic_position} /{" "}
              {meta.class_size ?? "?"}
            </div>
          )}
        </>
      )}

      {/* Section 4: Behavior & Development */}
      <SectionHeader title={t("behavior")} accent="#7c3aed" />
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "10pt",
        }}
      >
        <tbody>
          <BehaviorRow label={t("discipline")} value={meta?.discipline_rating} />
          <BehaviorRow label={t("participation")} value={meta?.participation_rating} />
          <BehaviorRow label={t("cleanliness")} value={meta?.cleanliness_rating} />
        </tbody>
      </table>

      {/* Section 5: Attendance */}
      <SectionHeader title={t("attendance")} accent="#ea580c" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          fontSize: "10pt",
        }}
      >
        <InfoBox label={t("daysPresent")} value={meta?.days_present ?? "—"} />
        <InfoBox label={t("daysAbsent")} value={meta?.days_absent ?? "—"} />
        <InfoBox
          label={t("attendancePct")}
          value={
            meta?.attendance_percentage
              ? `${meta.attendance_percentage}%`
              : "—"
          }
        />
      </div>

      {/* Section 6: Remarks */}
      <SectionHeader title={t("overallRemark")} accent="#0f172a" />
      <RemarkBox label={t("classTeacher")} value={meta?.class_teacher_remarks} />
      <RemarkBox
        label={t("islamicTeacher")}
        value={meta?.islamic_teacher_remarks}
      />
      <RemarkBox label={t("headTeacher")} value={meta?.head_teacher_remarks} />
      <div
        style={{
          padding: "8px 12px",
          background: "#fef3c7",
          borderLeft: "4px solid #f59e0b",
          fontSize: "10pt",
          margin: "8px 0",
          fontStyle: "italic",
        }}
      >
        {overallRemark(acAvg)}
      </div>

      {/* Section 7: Signatures */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px dashed #cbd5e1",
        }}
      >
        <SignatureBlock
          label={t("classTeacher")}
          name={teacherName || "_____________"}
        />
        <SignatureBlock
          label={t("headTeacher")}
          name={settings?.head_teacher_name || "_____________"}
          imgUrl={settings?.head_teacher_signature_url}
        />
        <SignatureBlock
          label={t("director")}
          name={settings?.director_name || "_____________"}
          imgUrl={settings?.director_signature_url}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "16px",
          paddingTop: "10px",
          borderTop: "1px solid #e2e8f0",
          fontSize: "8.5pt",
          color: "#64748b",
          textAlign: "center",
        }}
      >
        {t("nextTerm")}: _______ · {t("schoolFees")}: _______ · Computer-generated
        report
      </div>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────

const SectionHeader = ({
  title,
  accent = "#15803d",
}: {
  title: string;
  accent?: string;
}) => (
  <div
    style={{
      background: accent,
      color: "white",
      padding: "5px 10px",
      fontSize: "11pt",
      fontWeight: 700,
      marginTop: "14px",
      marginBottom: "6px",
      borderRadius: "3px",
    }}
  >
    {title}
  </div>
);

const PerfTable = ({
  subjects,
  getResult,
  classLevel,
  isRTL,
  labels,
  language,
  showScore = false,
  showGrade = true,
  accent = "#15803d",
}: {
  subjects: Subject[];
  getResult: (id: string) => TermResult | undefined;
  classLevel?: number;
  isRTL: boolean;
  labels: any;
  language: "en" | "ar";
  showScore?: boolean;
  showGrade?: boolean;
  accent?: string;
}) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "10pt",
      border: `1px solid ${accent}40`,
    }}
  >
    <thead>
      <tr style={{ background: `${accent}15` }}>
        <th
          style={{
            padding: "6px 8px",
            textAlign: isRTL ? "right" : "left",
            border: `1px solid ${accent}40`,
            width: "40%",
          }}
        >
          {labels.subject[language]}
        </th>
        {showScore && (
          <th
            style={{
              padding: "6px 8px",
              textAlign: "center",
              border: `1px solid ${accent}40`,
              width: "12%",
            }}
          >
            {labels.score[language]}
          </th>
        )}
        <th
          style={{
            padding: "6px 8px",
            textAlign: "center",
            border: `1px solid ${accent}40`,
            width: "12%",
          }}
        >
          {labels.grade[language]}
        </th>
        <th
          style={{
            padding: "6px 8px",
            textAlign: isRTL ? "right" : "left",
            border: `1px solid ${accent}40`,
          }}
        >
          {labels.remarks[language]}
        </th>
      </tr>
    </thead>
    <tbody>
      {subjects.map((s) => {
        const r = getResult(s.id);
        const grade =
          s.grading_type === "numeric" && r?.score != null
            ? calculateGrade(r.score, classLevel)
            : null;
        const display =
          s.grading_type === "numeric"
            ? grade?.grade ?? "—"
            : s.grading_type === "letter"
            ? r?.letter_grade ?? "—"
            : r?.juz_completed
            ? `${labels.juzCompleted[language]} ${r.juz_completed}`
            : "—";
        return (
          <tr key={s.id}>
            <td
              style={{
                padding: "5px 8px",
                border: `1px solid ${accent}30`,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {s.name}
            </td>
            {showScore && (
              <td
                style={{
                  padding: "5px 8px",
                  border: `1px solid ${accent}30`,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {r?.score ?? "—"}
              </td>
            )}
            <td
              style={{
                padding: "5px 8px",
                border: `1px solid ${accent}30`,
                textAlign: "center",
                fontWeight: 700,
                color: accent,
              }}
            >
              {display}
            </td>
            <td
              style={{
                padding: "5px 8px",
                border: `1px solid ${accent}30`,
                textAlign: isRTL ? "right" : "left",
                fontSize: "9pt",
                color: "#475569",
              }}
            >
              {r?.teacher_remarks ?? "—"}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const BehaviorRow = ({ label, value }: { label: string; value?: string | null }) => (
  <tr>
    <td
      style={{
        padding: "5px 10px",
        border: "1px solid #e2e8f0",
        background: "#faf5ff",
        fontWeight: 600,
        width: "40%",
      }}
    >
      {label}
    </td>
    <td style={{ padding: "5px 10px", border: "1px solid #e2e8f0" }}>
      {value || "—"}
    </td>
  </tr>
);

const InfoBox = ({ label, value }: { label: string; value: any }) => (
  <div
    style={{
      padding: "8px 10px",
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: "4px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: "8.5pt", color: "#9a3412", textTransform: "uppercase" }}>
      {label}
    </div>
    <div style={{ fontSize: "14pt", fontWeight: 700, color: "#ea580c", marginTop: "2px" }}>
      {value}
    </div>
  </div>
);

const RemarkBox = ({ label, value }: { label: string; value?: string | null }) => (
  <div style={{ marginBottom: "8px" }}>
    <div style={{ fontSize: "10pt", fontWeight: 600, marginBottom: "2px" }}>
      {label}:
    </div>
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: "3px",
        padding: "6px 10px",
        minHeight: "32px",
        fontSize: "9.5pt",
        background: "white",
      }}
    >
      {value || ""}
    </div>
  </div>
);

const SignatureBlock = ({
  label,
  name,
  imgUrl,
}: {
  label: string;
  name: string;
  imgUrl?: string;
}) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        height: "40px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {imgUrl ? (
        <img src={imgUrl} alt="signature" style={{ maxHeight: "38px", maxWidth: "100%" }} />
      ) : null}
    </div>
    <div style={{ borderTop: "1px solid #0f172a", paddingTop: "4px", fontSize: "9pt", fontWeight: 600 }}>
      {label}
    </div>
    <div style={{ fontSize: "9pt", color: "#475569", marginTop: "2px" }}>{name}</div>
  </div>
);
