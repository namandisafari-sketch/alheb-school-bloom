import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useClasses } from "@/hooks/useClasses";
import { useLearners } from "@/hooks/useLearners";
import { useTermResults, useSubjects } from "@/hooks/useTermResults";
import { Loader2, Printer, FileText } from "lucide-react";
import { ReportCard } from "@/components/reports/ReportCard";
import { Database } from "@/integrations/supabase/types";

type TermType = Database["public"]["Enums"]["term_type"];

const terms: { value: TermType; label: string }[] = [
  { value: "term_1", label: "Term 1" },
  { value: "term_2", label: "Term 2" },
  { value: "term_3", label: "Term 3" },
];

const Reports = () => {
  const [searchParams] = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  const [selectedClass, setSelectedClass] = useState<string>(searchParams.get("class") || "");
  const [selectedTerm, setSelectedTerm] = useState<TermType>((searchParams.get("term") as TermType) || "term_1");
  const [academicYear, setAcademicYear] = useState<number>(parseInt(searchParams.get("year") || String(currentYear)));
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);

  const { data: classes = [] } = useClasses();
  const { data: allLearners = [] } = useLearners();
  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const { data: subjects = [] } = useSubjects(selectedClassData?.level);
  const { data: termResults = [], isLoading } = useTermResults(selectedClass, selectedTerm, academicYear);

  const classLearners = allLearners.filter((l) => l.class_id === selectedClass);

  const toggleLearner = (learnerId: string) => {
    setSelectedLearners((prev) =>
      prev.includes(learnerId) ? prev.filter((id) => id !== learnerId) : [...prev, learnerId]
    );
  };

  const selectAll = () => {
    setSelectedLearners(classLearners.map((l) => l.id));
  };

  const deselectAll = () => {
    setSelectedLearners([]);
  };

  const handleBatchPrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Cards - ${selectedClassData?.name} - ${selectedTerm.replace("_", " ").toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; font-size: 12pt; }
            .report-card { page-break-after: always; padding: 20px; max-width: 210mm; margin: 0 auto; }
            .report-card:last-child { page-break-after: auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
            .school-name { font-size: 18pt; font-weight: bold; text-transform: uppercase; }
            .school-motto { font-style: italic; font-size: 10pt; }
            .report-title { font-size: 14pt; font-weight: bold; margin-top: 10px; text-transform: uppercase; }
            .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 15px; font-size: 11pt; }
            .info-row { display: flex; gap: 5px; }
            .info-label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; font-size: 10pt; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .competency-key { font-size: 9pt; margin-bottom: 10px; }
            .remarks-section { margin-top: 15px; }
            .remarks-box { border: 1px solid #000; padding: 10px; min-height: 50px; margin-bottom: 10px; }
            .signature-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 30px; }
            .signature-line { border-top: 1px solid #000; padding-top: 5px; text-align: center; font-size: 10pt; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getLearnerResults = (learnerId: string) => {
    return termResults.filter((r) => r.learner_id === learnerId);
  };

  return (
    <DashboardLayout title="Report Cards" subtitle="Generate and print learner reports">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Term</Label>
              <Select value={selectedTerm} onValueChange={(v) => setSelectedTerm(v as TermType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={String(academicYear)} onValueChange={(v) => setAcademicYear(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleBatchPrint}
                disabled={selectedLearners.length === 0}
                className="w-full"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Selected ({selectedLearners.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learner Selection */}
      {selectedClass && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Select Learners - {selectedClassData?.name}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : classLearners.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No learners in this class</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {classLearners.map((learner) => {
                  const results = getLearnerResults(learner.id);
                  const hasResults = results.length > 0;
                  
                  return (
                    <div
                      key={learner.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        selectedLearners.includes(learner.id) ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <Checkbox
                        checked={selectedLearners.includes(learner.id)}
                        onCheckedChange={() => toggleLearner(learner.id)}
                        disabled={!hasResults}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{learner.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {hasResults ? `${results.length} subjects recorded` : "No marks yet"}
                        </p>
                      </div>
                      {hasResults && (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hidden Print Content */}
      <div ref={printRef} className="hidden">
        {selectedLearners.map((learnerId) => {
          const learner = classLearners.find((l) => l.id === learnerId);
          const results = getLearnerResults(learnerId);
          
          if (!learner) return null;
          
          return (
            <ReportCard
              key={learnerId}
              learner={learner}
              results={results}
              subjects={subjects}
              className={selectedClassData?.name || ""}
              term={selectedTerm}
              academicYear={academicYear}
              teacherName={selectedClassData?.teacher_name || ""}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
