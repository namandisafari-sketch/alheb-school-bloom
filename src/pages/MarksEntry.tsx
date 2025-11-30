import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClasses } from "@/hooks/useClasses";
import { useLearners } from "@/hooks/useLearners";
import { useSubjects, useSaveTermResults, TermResultInput } from "@/hooks/useTermResults";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type CompetencyLevel = Database["public"]["Enums"]["competency_level"];
type TermType = Database["public"]["Enums"]["term_type"];

const competencyLevels: { value: CompetencyLevel; label: string }[] = [
  { value: "beginning", label: "BE - Beginning" },
  { value: "approaching", label: "AE - Approaching" },
  { value: "meeting", label: "ME - Meeting" },
  { value: "exceeding", label: "EE - Exceeding" },
];

const terms: { value: TermType; label: string }[] = [
  { value: "term_1", label: "Term 1" },
  { value: "term_2", label: "Term 2" },
  { value: "term_3", label: "Term 3" },
];

const MarksEntry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<TermType>("term_1");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<number>(currentYear);
const [marks, setMarks] = useState<Record<string, { score: string; competency: CompetencyLevel; remarks: string }>>({});

  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: allLearners = [] } = useLearners();
  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const { data: subjects = [] } = useSubjects(selectedClassData?.level);
  const saveResults = useSaveTermResults();

  const classLearners = allLearners.filter((l) => l.class_id === selectedClass);

  const handleMarkChange = (learnerId: string, field: "score" | "competency" | "remarks", value: string) => {
    setMarks((prev) => ({
      ...prev,
      [learnerId]: {
        ...prev[learnerId],
        score: prev[learnerId]?.score || "",
        competency: prev[learnerId]?.competency || "meeting" as CompetencyLevel,
        remarks: prev[learnerId]?.remarks || "",
        [field]: field === "competency" ? value as CompetencyLevel : value,
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedSubject || !selectedTerm) {
      toast({ title: "Error", description: "Please select class, subject, and term", variant: "destructive" });
      return;
    }

    const results: TermResultInput[] = Object.entries(marks)
      .filter(([_, data]) => data.score || data.competency)
      .map(([learnerId, data]) => ({
        learner_id: learnerId,
        subject_id: selectedSubject,
        class_id: selectedClass,
        term: selectedTerm,
        academic_year: academicYear,
        score: data.score ? parseFloat(data.score) : null,
        competency_rating: data.competency || "meeting" as CompetencyLevel,
        teacher_remarks: data.remarks || null,
      }));

    if (results.length === 0) {
      toast({ title: "Error", description: "No marks entered", variant: "destructive" });
      return;
    }

    try {
      await saveResults.mutateAsync(results);
      toast({ title: "Success", description: `Saved marks for ${results.length} learners` });
      setMarks({});
    } catch (error) {
      toast({ title: "Error", description: "Failed to save marks", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Marks Entry" subtitle="Enter learner marks by subject - Uganda New Curriculum">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Class & Subject</CardTitle>
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
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
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
              <Input
                type="number"
                value={academicYear}
                onChange={(e) => setAcademicYear(parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Table */}
      {selectedClass && selectedSubject && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {subjects.find((s) => s.id === selectedSubject)?.name} - {selectedClassData?.name}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/reports?class=${selectedClass}&term=${selectedTerm}&year=${academicYear}`)}>
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button onClick={handleSave} disabled={saveResults.isPending}>
                {saveResults.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Marks
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {classLearners.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No learners in this class</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Learner Name</TableHead>
                      <TableHead className="w-[100px]">Score (%)</TableHead>
                      <TableHead className="w-[180px]">Competency</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classLearners.map((learner, index) => (
                      <TableRow key={learner.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{learner.full_name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={marks[learner.id]?.score || ""}
                            onChange={(e) => handleMarkChange(learner.id, "score", e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={marks[learner.id]?.competency || "meeting"}
                            onValueChange={(v) => handleMarkChange(learner.id, "competency", v)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {competencyLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Teacher remarks..."
                            value={marks[learner.id]?.remarks || ""}
                            onChange={(e) => handleMarkChange(learner.id, "remarks", e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default MarksEntry;
