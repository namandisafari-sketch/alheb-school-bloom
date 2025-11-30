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
import { useLanguage } from "@/contexts/LanguageContext";
import { useAllStaff } from "@/hooks/useStaff";
import { useLearners } from "@/hooks/useLearners";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Search, Printer, Download, CreditCard, User } from "lucide-react";
import { StaffIDCard } from "@/components/idcards/StaffIDCard";
import { StudentIDCard } from "@/components/idcards/StudentIDCard";

const IDCards = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: staff = [] } = useAllStaff();
  const { data: learners = [] } = useLearners();
  const { data: settings } = useSiteSettings();

  const schoolInfo = settings?.landing_hero;
  const schoolName = schoolInfo?.school_name || "School Name";

  const filteredStaff = staff.filter((s) =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = learners.filter((l) =>
    l.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>ID Card</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
            body { 
              font-family: 'Cairo', 'Inter', sans-serif; 
              margin: 0; 
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .id-card {
              width: 340px;
              border: 2px solid #1a365d;
              border-radius: 12px;
              overflow: hidden;
              background: white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .card-header {
              background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%);
              color: white;
              padding: 16px;
              text-align: center;
            }
            .school-name {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 4px;
            }
            .card-type {
              font-size: 12px;
              opacity: 0.9;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .card-body {
              padding: 16px;
            }
            .photo-section {
              display: flex;
              justify-content: center;
              margin-bottom: 12px;
            }
            .photo {
              width: 100px;
              height: 120px;
              background: #e2e8f0;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #1a365d;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
              font-size: 13px;
            }
            .info-label {
              font-weight: 600;
              width: 100px;
              color: #4a5568;
            }
            .info-value {
              color: #1a202c;
            }
            .card-footer {
              background: #f7fafc;
              padding: 12px 16px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .validity {
              font-size: 11px;
              color: #718096;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .id-card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const selectedStaffMember = staff.find((s) => s.id === selectedStaff);
  const selectedStudentMember = learners.find((l) => l.id === selectedStudent);

  return (
    <DashboardLayout
      title={t("idCards")}
      subtitle={isRTL ? "إنشاء بطاقات الهوية للموظفين والطلاب" : "Generate ID cards for staff and students"}
    >
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <Tabs defaultValue="staff">
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

          <TabsContent value="staff" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selection Panel */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                    <Input
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                    />
                  </div>

                  <Select value={selectedStaff || ""} onValueChange={setSelectedStaff}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "اختر موظف" : "Select staff member"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStaff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.full_name} - {s.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedStaff && (
                    <div className="flex gap-2">
                      <Button onClick={handlePrint} className="flex-1">
                        <Printer className="h-4 w-4 mr-2" />
                        {t("print")}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        {t("download")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ID Card Preview */}
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <div ref={printRef}>
                    {selectedStaffMember ? (
                      <StaffIDCard
                        staff={selectedStaffMember}
                        schoolName={schoolName}
                        isRTL={isRTL}
                      />
                    ) : (
                      <div className="w-[340px] h-[440px] border-2 border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center">
                        <p className="text-muted-foreground">
                          {isRTL ? "اختر موظف لعرض البطاقة" : "Select staff to preview card"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selection Panel */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                    <Input
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                    />
                  </div>

                  <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "اختر طالب" : "Select student"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.full_name} - {l.admission_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedStudent && (
                    <div className="flex gap-2">
                      <Button onClick={handlePrint} className="flex-1">
                        <Printer className="h-4 w-4 mr-2" />
                        {t("print")}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        {t("download")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ID Card Preview */}
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <div ref={printRef}>
                    {selectedStudentMember ? (
                      <StudentIDCard
                        student={selectedStudentMember}
                        schoolName={schoolName}
                        isRTL={isRTL}
                      />
                    ) : (
                      <div className="w-[340px] h-[440px] border-2 border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center">
                        <p className="text-muted-foreground">
                          {isRTL ? "اختر طالب لعرض البطاقة" : "Select student to preview card"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IDCards;
