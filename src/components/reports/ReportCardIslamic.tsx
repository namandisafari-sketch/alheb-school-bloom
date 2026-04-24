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

// ─── UNEB-style aggregate (PLE) ────────────────────────────────────────────
// Aggregate points per subject (D1=1, D2=2, C3=3 ... F9=9) — lower total is better
const PLE_AGG: Record<string, number> = {
  D1: 1, D2: 2, C3: 3, C4: 4, C5: 5, C6: 6, P7: 7, P8: 8, F9: 9,
};

const getDivision = (totalAgg: number, subjectsCount: number): string => {
  if (!subjectsCount) return "—";
  // Standard UNEB-PLE Division bands (4 core subjects)
  if (totalAgg >= 4 && totalAgg <= 12) return "I";
  if (totalAgg >= 13 && totalAgg <= 23) return "II";
  if (totalAgg >= 24 && totalAgg <= 29) return "III";
  if (totalAgg >= 30 && totalAgg <= 34) return "IV";
  return "U";
};

export const ReportCardIslamic = ({
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

  // Show Islamic block only if learner is Muslim AND there are Islamic subjects
  const isMuslim = (learner.religion || "").toLowerCase().includes("islam") ||
                   (learner.religion || "").toLowerCase().includes("muslim");
  const showIslamic = isMuslim && islamicSubjects.length > 0;

  const getResult = (subjectId: string) =>
    results.find((r) => r.subject_id === subjectId);

  const academicScores = academicSubjects
    .map((s) => getResult(s.id)?.score)
    .filter((v): v is number => v !== null && v !== undefined);
  const { total: acTotal, average: acAvg } = computeAggregate(academicScores);
  const overallGrade = calculateGrade(acAvg, classLevel);

  // PLE-style aggregate calculation (only for P5-P7)
  const isUpperPrimary = (classLevel ?? 0) >= 5;
  const aggPoints = academicSubjects.map((s) => {
    const r = getResult(s.id);
    if (r?.score == null) return 0;
    const g = calculateGrade(r.score, classLevel);
    return PLE_AGG[g.grade] ?? 0;
  });
  const totalAgg = aggPoints.reduce((a, b) => a + b, 0);
  const division = isUpperPrimary ? getDivision(totalAgg, academicScores.length) : null;

  const labels = {
    motto: { en: "Education with Islamic Values", ar: "التعليم بالقيم الإسلامية" },
    schoolReport: { en: "LEARNER'S END OF TERM REPORT", ar: "تقرير نهاية الفصل للمتعلم" },
    name: { en: "NAME", ar: "الاسم" },
    class: { en: "CLASS", ar: "الفصل" },
    admNo: { en: "LIN / ADM NO", ar: "رقم القبول" },
    gender: { en: "SEX", ar: "الجنس" },
    male: { en: "M", ar: "ذكر" },
    female: { en: "F", ar: "أنثى" },
    house: { en: "HOUSE", ar: "البيت" },
    year: { en: "YEAR", ar: "السنة" },
    academicPerf: { en: "END OF TERM EXAM RESULTS", ar: "نتائج امتحانات نهاية الفصل" },
    islamicPerf: { en: "ISLAMIC STUDIES RESULTS", ar: "نتائج الدراسات الإسلامية" },
    monthlyAssess: { en: "MONTHLY ASSESSMENT", ar: "التقييم الشهري" },
    behavior: { en: "BEHAVIOR & DEVELOPMENT", ar: "السلوك والتطور" },
    attendance: { en: "ATTENDANCE", ar: "الحضور" },
    subject: { en: "SUBJECT", ar: "المادة" },
    fullMarks: { en: "FULL MARKS", ar: "الدرجة الكبرى" },
    marksGained: { en: "MARKS GAINED", ar: "الدرجة المتحصلة" },
    score: { en: "MARK", ar: "الدرجة" },
    grade: { en: "GRADE", ar: "التقدير" },
    agg: { en: "AGG", ar: "النقاط" },
    remark: { en: "REMARK", ar: "ملاحظات" },
    teacher: { en: "TEACHER", ar: "المعلم" },
    initials: { en: "T. INITIALS", ar: "التوقيع" },
    avgMark: { en: "AVERAGE MARK", ar: "المعدل" },
    position: { en: "POSITION", ar: "الترتيب" },
    aggregates: { en: "AGGREGATES", ar: "مجموع النقاط" },
    division: { en: "DIVISION", ar: "الشعبة" },
    outOf: { en: "OUT OF", ar: "من أصل" },
    daysPresent: { en: "Days Present", ar: "أيام الحضور" },
    daysAbsent: { en: "Days Absent", ar: "أيام الغياب" },
    attendancePct: { en: "Attendance %", ar: "نسبة الحضور" },
    discipline: { en: "Discipline", ar: "الانضباط" },
    participation: { en: "Participation", ar: "المشاركة" },
    cleanliness: { en: "Cleanliness", ar: "النظافة" },
    classTeacherComment: { en: "Class Teacher's Comment", ar: "ملاحظات المعلم" },
    headTeacherComment: { en: "Head Teacher's Comment", ar: "ملاحظات الناظر" },
    islamicTeacherComment: { en: "Islamic Studies Teacher's Comment", ar: "ملاحظات معلم الدراسات الإسلامية" },
    classTeacher: { en: "Class Teacher", ar: "معلم الفصل" },
    headTeacher: { en: "Head Teacher", ar: "ناظر المدرسة" },
    director: { en: "Director", ar: "المدير" },
    nextTerm: { en: "Next Term Begins", ar: "بداية الفصل القادم" },
    dateIssue: { en: "Date of Issue", ar: "تاريخ الإصدار" },
    schoolStamp: { en: "SCHOOL STAMP", ar: "ختم المدرسة" },
    grading: { en: "GRADING SCHEME", ar: "مفتاح التقدير" },
    requirements: { en: "School Requirements", ar: "متطلبات المدرسة" },
    juzCompleted: { en: "Juz", ar: "جزء" },
    page: { en: "Page", ar: "صفحة" },
  };
  const t = (k: keyof typeof labels) => labels[k][language];

  const schoolName =
    language === "ar"
      ? "مدرسة الهب الإسلامية الابتدائية"
      : "ALHEB ISLAMIC PRIMARY SCHOOL";
  const schoolNameAlt =
    language === "ar" ? "ALHEB PRIMARY SCHOOL" : "مدرسة اللهيب الابتدائية";

  // Issue date
  const today = new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB");

  return (
    <div
      className="report-card"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        fontFamily: isRTL
          ? "'Cairo','Amiri','Arial',sans-serif"
          : "'Inter','Helvetica',sans-serif",
        background: "white",
        color: "#0f172a",
        padding: "16mm 14mm",
        maxWidth: "210mm",
        margin: "0 auto",
        fontSize: "10pt",
        lineHeight: 1.35,
      }}
    >
      {/* ═══ BISMILLAH BANNER ═══ */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "'Amiri','Scheherazade New','Cairo',serif",
          fontSize: "20pt",
          color: "#15803d",
          padding: "4px 0 6px",
          letterSpacing: "0.5px",
          direction: "rtl",
        }}
      >
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>

      {/* ═══ HEADER ═══ Arabic name prominent, gold/green */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "12px",
          paddingBottom: "8px",
          borderBottom: "3px double #15803d",
        }}
      >
        <div
          style={{
            textAlign: "right",
            fontFamily: "'Amiri','Cairo',serif",
            fontSize: "18pt",
            fontWeight: 800,
            color: "#15803d",
            direction: "rtl",
          }}
        >
          مدرسة الهب الإسلامية
        </div>
        {settings?.school_logo_url ? (
          <img
            src={settings.school_logo_url}
            alt="logo"
            style={{ height: "70px", width: "70px", objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "50%",
              border: "2px solid #15803d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8pt",
              color: "#15803d",
              fontWeight: 700,
            }}
          >
            LOGO
          </div>
        )}
        <div style={{ textAlign: "left", fontSize: "14pt", fontWeight: 800, color: "#15803d" }}>
          ALHEB ISLAMIC<br />
          <span style={{ fontSize: "11pt", color: "#a16207" }}>PRIMARY SCHOOL</span>
        </div>
      </div>

      {/* Contact line */}
      <div
        style={{
          textAlign: "center",
          fontSize: "8.5pt",
          color: "#475569",
          padding: "4px 0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        P.O. Box 2891, Kampala, Uganda &nbsp;|&nbsp; Tel: 0788 402156 / 0745 397122
        &nbsp;|&nbsp; Email: aps@iico.org
        <div style={{ fontStyle: "italic", fontSize: "8pt", marginTop: "2px", color: "#64748b" }}>
          {language === "ar" ? schoolName : schoolNameAlt} — "{labels.motto[language]}"
        </div>
      </div>

      {/* Report title bar */}
      <div
        style={{
          textAlign: "center",
          fontSize: "13pt",
          fontWeight: 800,
          padding: "6px 0",
          marginTop: "8px",
          letterSpacing: "0.5px",
          color: "#0f172a",
        }}
      >
        {t("schoolReport")} — {termLabels[term][language]}, {academicYear}
      </div>

      {/* ═══ LEARNER INFO with photo ═══ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 90px",
          gap: "12px",
          padding: "8px 12px",
          border: "1.5px solid #0f172a",
          background: "#f8fafc",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px 16px",
            fontSize: "10pt",
          }}
        >
          <InfoLine label={t("name")} value={learner.full_name.toUpperCase()} bold />
          <InfoLine label={t("class")} value={className} bold />
          <InfoLine label={t("admNo")} value={learner.admission_number || "—"} />
          <InfoLine
            label={t("gender")}
            value={learner.gender === "male" ? t("male") : t("female")}
          />
          <InfoLine label={t("year")} value={String(academicYear)} />
          <InfoLine label={t("dateIssue")} value={today} />
        </div>
        <div
          style={{
            border: "1.5px dashed #cbd5e1",
            borderRadius: "4px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            minHeight: "100px",
          }}
        >
          {learner.photo_url ? (
            <img
              src={learner.photo_url}
              alt={learner.full_name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "8pt", color: "#94a3b8" }}>PHOTO</span>
          )}
        </div>
      </div>

      {/* ═══ ISLAMIC STUDIES FIRST (Muslim learner) ═══ */}
      {showIslamic && (
        <>
          <SectionTitle accent="#a16207">{t("islamicPerf")}</SectionTitle>
          <table style={tableStyle}>
            <thead>
              <tr style={{ ...headerRowStyle, background: "#fef3c7" }}>
                <th
                  style={{
                    ...thStyle,
                    width: "35%",
                    textAlign: isRTL ? "right" : "left",
                    borderColor: "#a16207",
                  }}
                >
                  {t("subject")}
                </th>
                <th style={{ ...thStyle, borderColor: "#a16207" }}>{t("fullMarks")}</th>
                <th style={{ ...thStyle, borderColor: "#a16207" }}>{t("marksGained")}</th>
                <th style={{ ...thStyle, borderColor: "#a16207" }}>{t("grade")}</th>
                <th
                  style={{
                    ...thStyle,
                    textAlign: isRTL ? "right" : "left",
                    borderColor: "#a16207",
                  }}
                >
                  {t("remark")}
                </th>
              </tr>
            </thead>
            <tbody>
              {islamicSubjects.map((s) => {
                const r = getResult(s.id);
                const display =
                  s.grading_type === "letter"
                    ? r?.letter_grade ?? "—"
                    : s.grading_type === "descriptive"
                    ? r?.juz_completed
                      ? `${labels.juzCompleted[language]} ${r.juz_completed}`
                      : "—"
                    : r?.score != null
                    ? calculateGrade(r.score, classLevel).grade
                    : "—";
                return (
                  <tr key={s.id}>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: isRTL ? "right" : "left",
                        fontWeight: 600,
                        borderColor: "#fde68a",
                      }}
                    >
                      {s.name}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center", borderColor: "#fde68a" }}>100</td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        fontWeight: 700,
                        borderColor: "#fde68a",
                      }}
                    >
                      {r?.score ?? "—"}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#a16207",
                        borderColor: "#fde68a",
                      }}
                    >
                      {display}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: isRTL ? "right" : "left",
                        fontStyle: "italic",
                        fontSize: "9pt",
                        borderColor: "#fde68a",
                      }}
                    >
                      {r?.teacher_remarks ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {/* ═══ ACADEMIC RESULTS TABLE ═══ */}
      <SectionTitle>{t("academicPerf")}</SectionTitle>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={{ ...thStyle, width: "30%", textAlign: isRTL ? "right" : "left" }}>
              {t("subject")}
            </th>
            <th style={thStyle}>{t("fullMarks")}</th>
            <th style={thStyle}>{t("marksGained")}</th>
            {isUpperPrimary && <th style={thStyle}>{t("agg")}</th>}
            <th style={thStyle}>{t("grade")}</th>
            <th style={{ ...thStyle, textAlign: isRTL ? "right" : "left" }}>{t("remark")}</th>
            <th style={thStyle}>{t("initials")}</th>
          </tr>
        </thead>
        <tbody>
          {academicSubjects.map((s) => {
            const r = getResult(s.id);
            const grade = r?.score != null ? calculateGrade(r.score, classLevel) : null;
            const agg = grade ? PLE_AGG[grade.grade] ?? "—" : "—";
            return (
              <tr key={s.id}>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: isRTL ? "right" : "left",
                    fontWeight: 600,
                  }}
                >
                  {s.name.toUpperCase()}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>100</td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "11pt",
                  }}
                >
                  {r?.score ?? "—"}
                </td>
                {isUpperPrimary && (
                  <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700 }}>
                    {agg}
                  </td>
                )}
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    fontWeight: 800,
                    color: grade ? "#15803d" : "#94a3b8",
                  }}
                >
                  {grade?.grade ?? "—"}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: isRTL ? "right" : "left",
                    fontStyle: "italic",
                    fontSize: "9pt",
                  }}
                >
                  {r?.teacher_remarks || grade?.remark || "—"}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {r?.recorded_by ? "✓" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ═══ SUMMARY GREEN BAR (Islamic theme) ═══ */}
      <div
        style={{
          background: "#15803d",
          color: "white",
          padding: "8px 12px",
          marginTop: "0",
          display: "grid",
          gridTemplateColumns: isUpperPrimary ? "1fr 1fr 1fr 1fr" : "1fr 1fr",
          gap: "8px",
          fontSize: "10pt",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        <span>
          {t("avgMark")}: <span style={{ color: "#fde68a" }}>{acAvg ? acAvg.toFixed(1) : "—"}</span>
        </span>
        <span>
          {t("position")}:{" "}
          <span style={{ color: "#fde68a" }}>
            {meta?.academic_position ?? "—"} {t("outOf")} {meta?.class_size ?? "?"}
          </span>
        </span>
        {isUpperPrimary && (
          <>
            <span>
              {t("aggregates")}: <span style={{ color: "#fde68a" }}>{totalAgg || "—"}</span>
            </span>
            <span>
              {t("division")}: <span style={{ color: "#fef08a" }}>{division}</span>
            </span>
          </>
        )}
      </div>


      {/* ═══ ATTENDANCE & BEHAVIOR (compact row) ═══ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <div>
          <SectionTitle accent="#ea580c" compact>{t("attendance")}</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "4px",
              fontSize: "9pt",
            }}
          >
            <CompactBox label={t("daysPresent")} value={meta?.days_present ?? "—"} />
            <CompactBox label={t("daysAbsent")} value={meta?.days_absent ?? "—"} />
            <CompactBox
              label={t("attendancePct")}
              value={meta?.attendance_percentage ? `${meta.attendance_percentage}%` : "—"}
            />
          </div>
        </div>
        <div>
          <SectionTitle accent="#7c3aed" compact>{t("behavior")}</SectionTitle>
          <table style={{ ...tableStyle, fontSize: "9pt" }}>
            <tbody>
              <BehaviorRow label={t("discipline")} value={meta?.discipline_rating} />
              <BehaviorRow label={t("participation")} value={meta?.participation_rating} />
              <BehaviorRow label={t("cleanliness")} value={meta?.cleanliness_rating} />
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ GRADING SCHEME REFERENCE ═══ */}
      <div
        style={{
          marginTop: "10px",
          border: "1px solid #cbd5e1",
          padding: "6px 10px",
          fontSize: "8.5pt",
          background: "#f8fafc",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "4px", color: "#475569" }}>
          {t("grading")}:
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px 12px",
            color: "#475569",
          }}
        >
          {isUpperPrimary ? (
            <>
              <span>80+ → D1</span>
              <span>75-79 → D2</span>
              <span>70-74 → C3</span>
              <span>65-69 → C4</span>
              <span>60-64 → C5</span>
              <span>55-59 → C6</span>
              <span>50-54 → P7</span>
              <span>45-49 → P8</span>
              <span>0-44 → F9</span>
            </>
          ) : (
            <>
              <span>80+ → A (Excellent)</span>
              <span>70-79 → B (Very Good)</span>
              <span>60-69 → C (Good)</span>
              <span>50-59 → D (Fair)</span>
              <span>0-49 → E (Needs work)</span>
            </>
          )}
        </div>
      </div>

      {/* ═══ COMMENTS BLOCK ═══ */}
      <div
        style={{
          marginTop: "10px",
          border: "1.5px solid #ef4444",
          borderRadius: "2px",
        }}
      >
        <CommentRow
          label={t("classTeacherComment")}
          value={meta?.class_teacher_remarks}
          signer={teacherName || "_____________"}
        />
        {showIslamic && (
          <CommentRow
            label={t("islamicTeacherComment")}
            value={meta?.islamic_teacher_remarks}
            signer="_____________"
            divider
          />
        )}
        <CommentRow
          label={t("headTeacherComment")}
          value={meta?.head_teacher_remarks}
          signer={settings?.head_teacher_name || "_____________"}
          divider
        />
      </div>

      {/* Auto remark */}
      <div
        style={{
          padding: "6px 10px",
          background: "#fef3c7",
          borderLeft: "4px solid #f59e0b",
          fontSize: "9pt",
          margin: "8px 0",
          fontStyle: "italic",
        }}
      >
        {overallRemark(acAvg)}
      </div>

      {/* ═══ FOOTER: Stamp area + Next term ═══ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "16px",
          alignItems: "end",
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "1px solid #cbd5e1",
        }}
      >
        <div style={{ fontSize: "9pt" }}>
          <div style={{ marginBottom: "4px" }}>
            <strong>{t("dateIssue")}:</strong> {today}
          </div>
          <div style={{ marginBottom: "4px" }}>
            <strong>{t("nextTerm")}:</strong> _____________________
          </div>
          {/* Sheikh / Islamic Head Teacher signatory */}
          <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ borderTop: "1px solid #15803d", paddingTop: "4px", fontSize: "9pt" }}>
              <strong style={{ color: "#15803d" }}>
                {language === "ar" ? "الشيخ / معلم الدراسات الإسلامية" : "Sheikh / Islamic Studies Head"}
              </strong>
              <div style={{ color: "#64748b", fontSize: "8pt" }}>_____________________</div>
            </div>
            <div style={{ borderTop: "1px solid #0f172a", paddingTop: "4px", fontSize: "9pt" }}>
              <strong>{t("headTeacher")}:</strong>{" "}
              <span>{settings?.head_teacher_name || "_____________"}</span>
            </div>
          </div>
          <div style={{ color: "#64748b", fontSize: "8pt", marginTop: "6px" }}>
            <strong>{t("requirements")}:</strong> Broom, Ream, Uniform, Box file...
          </div>
        </div>
        <div
          style={{
            width: "120px",
            height: "70px",
            border: "2px solid #0f172a",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8pt",
            fontWeight: 700,
            color: "#0f172a",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {t("schoolStamp")}
          <br />
          ALHEB
        </div>
      </div>

      {/* Page footer */}
      <div
        style={{
          marginTop: "10px",
          paddingTop: "6px",
          borderTop: "1px solid #e2e8f0",
          fontSize: "8pt",
          color: "#64748b",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          {language === "ar"
            ? `شعار المدرسة: "${labels.motto.ar}"`
            : `School Motto: "${labels.motto.en}"`}
        </span>
        <span>{t("page")} 1</span>
      </div>
    </div>
  );
};

// ─── Sub-components & shared styles ───────────────────────────────────────

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "10pt",
  border: "1.5px solid #0f172a",
};

const headerRowStyle: React.CSSProperties = {
  background: "#dcfce7",
};

const thStyle: React.CSSProperties = {
  padding: "5px 6px",
  border: "1px solid #15803d",
  textAlign: "center",
  fontSize: "9pt",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#0f172a",
};

const tdStyle: React.CSSProperties = {
  padding: "4px 6px",
  border: "1px solid #cbd5e1",
  fontSize: "10pt",
};

const SectionTitle = ({
  children,
  accent = "#15803d",
  compact = false,
}: {
  children: React.ReactNode;
  accent?: string;
  compact?: boolean;
}) => (
  <div
    style={{
      background: accent,
      color: "white",
      padding: compact ? "3px 8px" : "5px 10px",
      fontSize: compact ? "9.5pt" : "10.5pt",
      fontWeight: 700,
      marginTop: compact ? "0" : "10px",
      marginBottom: "0",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const InfoLine = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
    <span style={{ fontSize: "8.5pt", color: "#475569", fontWeight: 600 }}>
      {label}:
    </span>
    <span
      style={{
        flex: 1,
        borderBottom: "1px dotted #94a3b8",
        fontWeight: bold ? 700 : 500,
        fontSize: "10pt",
      }}
    >
      {value}
    </span>
  </div>
);

const CompactBox = ({ label, value }: { label: string; value: any }) => (
  <div
    style={{
      padding: "5px 6px",
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: "3px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: "7.5pt", color: "#9a3412", textTransform: "uppercase" }}>
      {label}
    </div>
    <div style={{ fontSize: "12pt", fontWeight: 800, color: "#ea580c" }}>{value}</div>
  </div>
);

const BehaviorRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <tr>
    <td
      style={{
        padding: "3px 8px",
        border: "1px solid #e2e8f0",
        background: "#faf5ff",
        fontWeight: 600,
        width: "55%",
        fontSize: "9pt",
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: "3px 8px",
        border: "1px solid #e2e8f0",
        fontSize: "9pt",
        fontWeight: 600,
        color: "#7c3aed",
      }}
    >
      {value || "—"}
    </td>
  </tr>
);

const CommentRow = ({
  label,
  value,
  signer,
  divider = false,
}: {
  label: string;
  value?: string | null;
  signer: string;
  divider?: boolean;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "150px 1fr 130px",
      borderTop: divider ? "1.5px solid #ef4444" : "none",
      minHeight: "44px",
    }}
  >
    <div
      style={{
        padding: "6px 8px",
        background: "#fef2f2",
        borderRight: "1.5px solid #ef4444",
        fontWeight: 700,
        fontSize: "9pt",
        color: "#7f1d1d",
        display: "flex",
        alignItems: "center",
      }}
    >
      {label}
    </div>
    <div
      style={{
        padding: "6px 10px",
        fontSize: "9.5pt",
        fontStyle: value ? "italic" : "normal",
        color: value ? "#0f172a" : "#94a3b8",
        display: "flex",
        alignItems: "center",
      }}
    >
      {value || "—"}
    </div>
    <div
      style={{
        padding: "6px 8px",
        borderLeft: "1.5px solid #ef4444",
        fontSize: "9pt",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {signer}
    </div>
  </div>
);
