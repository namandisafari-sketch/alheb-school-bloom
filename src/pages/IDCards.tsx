import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAllStaff } from "@/hooks/useStaff";
import { useLearners } from "@/hooks/useLearners";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useIdCardSettings } from "@/hooks/useIdCardSettings";
import { Search, Download, CreditCard, User, ChevronDown, Loader2 } from "lucide-react";
import { StaffIDCard } from "@/components/idcards/StaffIDCard";
import { StudentIDCard } from "@/components/idcards/StudentIDCard";
import { toPng } from "html-to-image";
import { toast } from "@/hooks/use-toast";

const IDCards = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const { data: staff = [] } = useAllStaff();
  const { data: learners = [] } = useLearners();
  const { data: siteSettings } = useSiteSettings();
  const { data: idSettings } = useIdCardSettings();

  const schoolName = siteSettings?.landing_hero?.school_name || "School Name";

  const filteredStaff = staff.filter((s) =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredStudents = learners.filter((l) =>
    l.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStaffMember = staff.find((s) => s.id === selectedStaff);
  const selectedStudentMember = learners.find((l) => l.id === selectedStudent);

  const exportNode = async (node: HTMLElement | null, filename: string) => {
    if (!node) return;
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const handleExport = async (which: "front" | "back" | "both") => {
    const subject = selectedStaffMember || selectedStudentMember;
    if (!subject) return;
    const baseName = subject.full_name.replace(/[^a-z0-9]/gi, "_");
    setExporting(true);
    try {
      if (which === "front" || which === "both") {
        await exportNode(frontRef.current, `${baseName}_ID_FRONT.png`);
      }
      if (which === "back" || which === "both") {
        await exportNode(backRef.current, `${baseName}_ID_BACK.png`);
      }
      toast({ title: isRTL ? "تم التصدير" : "Exported", description: isRTL ? "تم تنزيل البطاقة" : "ID card downloaded" });
    } catch (e) {
      console.error(e);
      toast({ title: isRTL ? "فشل" : "Failed", description: String(e), variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const ExportMenu = ({ disabled }: { disabled?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled || exporting} className="w-full sm:w-auto">
          {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {isRTL ? "تصدير PNG" : "Export PNG"}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("front")}>{isRTL ? "الوجه الأمامي فقط" : "Front side only"}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("back")}>{isRTL ? "الوجه الخلفي فقط" : "Back side only"}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("both")}>{isRTL ? "كلا الجانبين" : "Both sides"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const previewSettings = idSettings || {
    director_name: "",
    director_signature_url: "",
    head_teacher_name: "",
    head_teacher_signature_url: "",
    school_logo_url: "",
    back_policy: "",
    back_policy_ar: "",
  };

  return (
    <DashboardLayout
      title={t("idCards")}
      subtitle={isRTL ? "إنشاء بطاقات الهوية للموظفين والطلاب" : "Generate ID cards for staff and students"}
    >
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="staff" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {isRTL ? "بطاقات الموظفين" : "Staff ID Cards"}
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <User className="h-4 w-4" />
              {isRTL ? "بطاقات الطلاب" : "Student ID Cards"}
            </TabsTrigger>
          </TabsList>

          {/* STAFF */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                    <Input
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                    />
                  </div>
                  <Select value={selectedStaff || ""} onValueChange={setSelectedStaff}>
                    <SelectTrigger className="sm:w-[280px]">
                      <SelectValue placeholder={isRTL ? "اختر موظف" : "Select staff member"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStaff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.full_name} — {s.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ExportMenu disabled={!selectedStaffMember} />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CardSlot title={isRTL ? "الوجه الأمامي" : "Front Side"}>
                <div ref={frontRef} className="inline-block">
                  {selectedStaffMember ? (
                    <StaffIDCard staff={selectedStaffMember} schoolName={schoolName} isRTL={isRTL} side="front" settings={previewSettings} />
                  ) : (
                    <Placeholder isRTL={isRTL} />
                  )}
                </div>
              </CardSlot>
              <CardSlot title={isRTL ? "الوجه الخلفي" : "Back Side"}>
                <div ref={backRef} className="inline-block">
                  {selectedStaffMember ? (
                    <StaffIDCard staff={selectedStaffMember} schoolName={schoolName} isRTL={isRTL} side="back" settings={previewSettings} />
                  ) : (
                    <Placeholder isRTL={isRTL} />
                  )}
                </div>
              </CardSlot>
            </div>
          </TabsContent>

          {/* STUDENTS */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                    <Input
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                    />
                  </div>
                  <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="sm:w-[280px]">
                      <SelectValue placeholder={isRTL ? "اختر طالب" : "Select student"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.full_name} — {l.admission_number || "—"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ExportMenu disabled={!selectedStudentMember} />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CardSlot title={isRTL ? "الوجه الأمامي" : "Front Side"}>
                <div ref={frontRef} className="inline-block">
                  {selectedStudentMember ? (
                    <StudentIDCard student={selectedStudentMember} schoolName={schoolName} isRTL={isRTL} side="front" settings={previewSettings} />
                  ) : (
                    <Placeholder isRTL={isRTL} />
                  )}
                </div>
              </CardSlot>
              <CardSlot title={isRTL ? "الوجه الخلفي" : "Back Side"}>
                <div ref={backRef} className="inline-block">
                  {selectedStudentMember ? (
                    <StudentIDCard student={selectedStudentMember} schoolName={schoolName} isRTL={isRTL} side="back" settings={previewSettings} />
                  ) : (
                    <Placeholder isRTL={isRTL} />
                  )}
                </div>
              </CardSlot>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const CardSlot = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-sm font-semibold text-muted-foreground mb-3">{title}</p>
      <div className="overflow-x-auto no-scrollbar flex justify-center">{children}</div>
    </CardContent>
  </Card>
);

const Placeholder = ({ isRTL }: { isRTL: boolean }) => (
  <div className="w-[540px] max-w-full h-[340px] border-2 border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center">
    <p className="text-muted-foreground text-sm">{isRTL ? "اختر شخصًا لعرض البطاقة" : "Select someone to preview"}</p>
  </div>
);

export default IDCards;
