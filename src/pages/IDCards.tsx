import { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
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
import { useClasses } from "@/hooks/useClasses";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useIdCardSettings } from "@/hooks/useIdCardSettings";
import { Search, Download, CreditCard, User, ChevronDown, Loader2, Package, UserCheck } from "lucide-react";
import { StaffIDCard } from "@/components/idcards/StaffIDCard";
import { StudentIDCard } from "@/components/idcards/StudentIDCard";
import { VisitorIDCard } from "@/components/idcards/VisitorIDCard";
import { useVisitors, useVisitorVisits } from "@/hooks/useVisitors";
import { toPng } from "html-to-image";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";

const IDCards = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [batchClass, setBatchClass] = useState<string>("all");
  const [exporting, setExporting] = useState(false);
  const [batchExporting, setBatchExporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const { data: staff = [] } = useAllStaff();
  const { data: learners = [] } = useLearners();
  const { data: classes = [] } = useClasses();
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

  const previewSettings = idSettings || {
    director_name: "",
    director_signature_url: "",
    head_teacher_name: "",
    head_teacher_signature_url: "",
    school_logo_url: "",
    back_policy: "",
    back_policy_ar: "",
  };

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
      toast({ title: t("exported"), description: t("cardDownloaded") });
    } catch (e) {
      console.error(e);
      toast({ title: t("exportFailed"), description: String(e), variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  // Render an ID card to a PNG dataURL via an off-screen container
  const renderCardToPng = async (cardJsx: React.ReactElement): Promise<string> => {
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "-10000px";
    host.style.top = "0";
    host.style.background = "white";
    document.body.appendChild(host);
    const root = createRoot(host);

    return new Promise<string>((resolve, reject) => {
      root.render(cardJsx);
      // Allow a tick for fonts/images to render
      setTimeout(async () => {
        try {
          const target = host.firstElementChild as HTMLElement | null;
          if (!target) throw new Error("Card render failed");
          const dataUrl = await toPng(target, {
            pixelRatio: 3,
            cacheBust: true,
            backgroundColor: "#ffffff",
          });
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        } finally {
          root.unmount();
          host.remove();
        }
      }, 250);
    });
  };

  const dataUrlToBlob = (dataUrl: string): Blob => {
    const [meta, b64] = dataUrl.split(",");
    const mime = meta.match(/data:(.*?);/)?.[1] || "image/png";
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  const handleBatchExport = async () => {
    const targets =
      batchClass === "all"
        ? learners
        : learners.filter((l) => l.class_id === batchClass);

    if (targets.length === 0) {
      toast({ title: t("noData"), variant: "destructive" });
      return;
    }

    setBatchExporting(true);
    setBatchProgress({ current: 0, total: targets.length });
    const zip = new JSZip();

    try {
      for (let i = 0; i < targets.length; i++) {
        const learner = targets[i];
        const safe = learner.full_name.replace(/[^a-z0-9]/gi, "_");
        const className = (learner.classes?.name || learner.class_name || "Unassigned").replace(
          /[^a-z0-9]/gi,
          "_"
        );
        const folder = zip.folder(className)!;

        const frontUrl = await renderCardToPng(
          <StudentIDCard
            student={learner}
            schoolName={schoolName}
            isRTL={isRTL}
            side="front"
            settings={previewSettings}
          />
        );
        const backUrl = await renderCardToPng(
          <StudentIDCard
            student={learner}
            schoolName={schoolName}
            isRTL={isRTL}
            side="back"
            settings={previewSettings}
          />
        );

        folder.file(`${safe}_FRONT.png`, dataUrlToBlob(frontUrl));
        folder.file(`${safe}_BACK.png`, dataUrlToBlob(backUrl));

        setBatchProgress({ current: i + 1, total: targets.length });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const label =
        batchClass === "all"
          ? "all_classes"
          : (classes.find((c) => c.id === batchClass)?.name || "class").replace(/[^a-z0-9]/gi, "_");
      a.download = `ID_Cards_${label}_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: t("exported"), description: `${targets.length} × ${t("idCards")}` });
    } catch (e) {
      console.error(e);
      toast({ title: t("exportFailed"), description: String(e), variant: "destructive" });
    } finally {
      setBatchExporting(false);
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  const ExportMenu = ({ disabled }: { disabled?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled || exporting} className="w-full sm:w-auto">
          {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {t("exportPng")}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("front")}>{t("frontSideOnly")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("back")}>{t("backSideOnly")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("both")}>{t("bothSides")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DashboardLayout title={t("idCards")} subtitle={t("generateIdSubtitle")}>
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="staff" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {t("staffIdCards")}
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <User className="h-4 w-4" />
              {t("studentIdCards")}
            </TabsTrigger>
            <TabsTrigger value="visitors" className="gap-2">
              <UserCheck className="h-4 w-4" />
              Visitor IDs
            </TabsTrigger>
          </TabsList>

          {/* STAFF */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
                    />
                    <Input
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                    />
                  </div>
                  <Select value={selectedStaff || ""} onValueChange={setSelectedStaff}>
                    <SelectTrigger className="sm:w-[280px]">
                      <SelectValue placeholder={t("selectStaffMember")} />
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
              <CardSlot title={t("frontSide")}>
                <div ref={frontRef} className="inline-block">
                  {selectedStaffMember ? (
                    <StaffIDCard
                      staff={selectedStaffMember}
                      schoolName={schoolName}
                      isRTL={isRTL}
                      side="front"
                      settings={previewSettings}
                    />
                  ) : (
                    <Placeholder label={t("selectToPreview")} />
                  )}
                </div>
              </CardSlot>
              <CardSlot title={t("backSide")}>
                <div ref={backRef} className="inline-block">
                  {selectedStaffMember ? (
                    <StaffIDCard
                      staff={selectedStaffMember}
                      schoolName={schoolName}
                      isRTL={isRTL}
                      side="back"
                      settings={previewSettings}
                    />
                  ) : (
                    <Placeholder label={t("selectToPreview")} />
                  )}
                </div>
              </CardSlot>
            </div>
          </TabsContent>

          {/* STUDENTS */}
          <TabsContent value="students" className="space-y-4">
            {/* Single student controls */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
                    />
                    <Input
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                    />
                  </div>
                  <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="sm:w-[280px]">
                      <SelectValue placeholder={t("selectStudent")} />
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

            {/* Batch export controls */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Package className="h-4 w-4" />
                  {t("batchExport")}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={batchClass} onValueChange={setBatchClass}>
                    <SelectTrigger className="sm:w-[280px]">
                      <SelectValue placeholder={t("selectClass")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("allClasses")} ({learners.length})
                      </SelectItem>
                      {classes.map((c) => {
                        const count = learners.filter((l) => l.class_id === c.id).length;
                        return (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleBatchExport}
                    disabled={batchExporting}
                    className="w-full sm:w-auto gap-2"
                  >
                    {batchExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("generatingZip")} ({batchProgress.current}/{batchProgress.total})
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        {t("downloadZip")}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CardSlot title={t("frontSide")}>
                <div ref={frontRef} className="inline-block">
                  {selectedStudentMember ? (
                    <StudentIDCard
                      student={selectedStudentMember}
                      schoolName={schoolName}
                      isRTL={isRTL}
                      side="front"
                      settings={previewSettings}
                    />
                  ) : (
                    <Placeholder label={t("selectToPreview")} />
                  )}
                </div>
              </CardSlot>
              <CardSlot title={t("backSide")}>
                <div ref={backRef} className="inline-block">
                  {selectedStudentMember ? (
                    <StudentIDCard
                      student={selectedStudentMember}
                      schoolName={schoolName}
                      isRTL={isRTL}
                      side="back"
                      settings={previewSettings}
                    />
                  ) : (
                    <Placeholder label={t("selectToPreview")} />
                  )}
                </div>
              </CardSlot>
            </div>
          </TabsContent>
          <TabsContent value="visitors" className="space-y-4">
            <VisitorIdSection schoolName={schoolName} schoolLogoUrl={previewSettings.school_logo_url} isRTL={isRTL} />
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

const Placeholder = ({ label }: { label: string }) => (
  <div className="w-[540px] max-w-full h-[340px] border-2 border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center">
    <p className="text-muted-foreground text-sm">{label}</p>
  </div>
);

const VisitorIdSection = ({
  schoolName,
  schoolLogoUrl,
  isRTL,
}: {
  schoolName: string;
  schoolLogoUrl?: string;
  isRTL: boolean;
}) => {
  const { data: visits = [] } = useVisitorVisits("active");
  const { data: visitors = [] } = useVisitors();
  const [visitId, setVisitId] = useState<string>("");
  const [visitorId, setVisitorId] = useState<string>("");
  const dayRef = useRef<HTMLDivElement>(null);
  const reusableRef = useRef<HTMLDivElement>(null);

  const visit = visits.find((v) => v.id === visitId);
  const visitor = visitors.find((v) => v.id === visitorId);

  const exportCard = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { pixelRatio: 3, cacheBust: true, backgroundColor: "#ffffff" });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${name.replace(/[^a-z0-9]/gi, "_")}_VISITOR.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <UserCheck className="h-4 w-4" />
            Day Pass (from active check-in)
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={visitId} onValueChange={setVisitId}>
              <SelectTrigger className="sm:w-[320px]">
                <SelectValue placeholder="Select on-site visitor…" />
              </SelectTrigger>
              <SelectContent>
                {visits.length === 0 && <div className="p-2 text-xs text-muted-foreground">No active visits</div>}
                {visits.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.visitor_name} — {v.badge_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!visit} onClick={() => visit && exportCard(dayRef, visit.visitor_name)}>
              <Download className="h-4 w-4 mr-2" />Print Day Pass
            </Button>
          </div>
          <div className="flex justify-center pt-2">
            <div ref={dayRef} className="inline-block">
              {visit ? (
                <VisitorIDCard visit={visit} schoolName={schoolName} schoolLogoUrl={schoolLogoUrl} isRTL={isRTL} variant="day-pass" />
              ) : (
                <Placeholder label="Check in a visitor to print a day pass" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="h-4 w-4" />
            Reusable Visitor Card (recurring visitors)
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={visitorId} onValueChange={setVisitorId}>
              <SelectTrigger className="sm:w-[320px]">
                <SelectValue placeholder="Select recurring visitor…" />
              </SelectTrigger>
              <SelectContent>
                {visitors.filter((v) => v.is_recurring).length === 0 && <div className="p-2 text-xs text-muted-foreground">No recurring visitors</div>}
                {visitors.filter((v) => v.is_recurring).map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.full_name}{v.company ? ` — ${v.company}` : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!visitor} onClick={() => visitor && exportCard(reusableRef, visitor.full_name)}>
              <Download className="h-4 w-4 mr-2" />Print Card
            </Button>
          </div>
          <div className="flex justify-center pt-2">
            <div ref={reusableRef} className="inline-block">
              {visitor ? (
                <VisitorIDCard visitor={visitor} schoolName={schoolName} schoolLogoUrl={schoolLogoUrl} isRTL={isRTL} variant="reusable" />
              ) : (
                <Placeholder label="Add recurring visitors in the Visitors page" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
