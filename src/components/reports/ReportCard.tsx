import { Learner } from "@/hooks/useLearners";
import { TermResult } from "@/hooks/useTermResults";
import { Database } from "@/integrations/supabase/types";

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

const competencyLabels: Record<string, string> = {
  beginning: "Beginning",
  approaching: "Approaching",
  meeting: "Meeting",
  exceeding: "Exceeding",
};

const competencyShort: Record<string, string> = {
  beginning: "BE",
  approaching: "AE",
  meeting: "ME",
  exceeding: "EE",
};

const termLabels: Record<TermType, string> = {
  term_1: "TERM ONE",
  term_2: "TERM TWO",
  term_3: "TERM THREE",
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

  return (
    <div className="report-card">
      {/* Header */}
      <div className="header">
        <div className="school-name">ALHEB ISLAMIC PRIMARY SCHOOL</div>
        <div className="school-motto">"Education with Islamic Values"</div>
        <div style={{ fontSize: "10pt", marginTop: "5px" }}>
          P.O. Box 123, Kampala, Uganda | Tel: +256 xxx xxx xxx
        </div>
        <div className="report-title">
          {termLabels[term]} REPORT CARD - {academicYear}
        </div>
      </div>

      {/* Student Info */}
      <div className="student-info">
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span>{learner.full_name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Class:</span>
          <span>{className}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Admission No:</span>
          <span>{learner.admission_number || "N/A"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Gender:</span>
          <span style={{ textTransform: "capitalize" }}>{learner.gender}</span>
        </div>
      </div>

      {/* Competency Key */}
      <div className="competency-key">
        <strong>Competency Key:</strong> BE = Beginning | AE = Approaching Expectation | ME = Meeting Expectation | EE = Exceeding Expectation
      </div>

      {/* Results Table */}
      <table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Subject</th>
            <th style={{ width: "15%", textAlign: "center" }}>Score (%)</th>
            <th style={{ width: "15%", textAlign: "center" }}>Competency</th>
            <th style={{ width: "30%" }}>Teacher's Remarks</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => {
            const result = getResultForSubject(subject.id);
            return (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td style={{ textAlign: "center" }}>{result?.score ?? "-"}</td>
                <td style={{ textAlign: "center" }}>{result?.competency_rating ? competencyShort[result.competency_rating] : "-"}</td>
                <td>{result?.teacher_remarks || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ marginTop: "10px", fontWeight: "bold" }}>
        Overall Competency: {competencyShort[calculateOverallCompetency()] || calculateOverallCompetency()} ({competencyLabels[calculateOverallCompetency()] || "N/A"})
      </div>

      {/* Remarks Section */}
      <div className="remarks-section">
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>Class Teacher's Remarks:</div>
        <div className="remarks-box"></div>
        
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>Head Teacher's Remarks:</div>
        <div className="remarks-box"></div>
      </div>

      {/* Signatures */}
      <div className="signature-section">
        <div>
          <div className="signature-line">Class Teacher</div>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "3px" }}>{teacherName || "_____________"}</div>
        </div>
        <div>
          <div className="signature-line">Head Teacher</div>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "3px" }}>_____________</div>
        </div>
        <div>
          <div className="signature-line">Parent/Guardian</div>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "3px" }}>{learner.guardian_name || "_____________"}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "9pt", borderTop: "1px solid #000", paddingTop: "10px" }}>
        Next Term Begins: _____________ | School Fees: _____________ | This report is computer generated.
      </div>
    </div>
  );
};
