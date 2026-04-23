import { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, CreditCard, User, ChevronDown, Loader2, Package, UserCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { StaffIDCard } from "@/components/idcards/StaffIDCard";
import { StudentIDCard } from "@/components/idcards/StudentIDCard";
import { VisitorIDCard } from "@/components/idcards/VisitorIDCard";
import { useVisitors, useVisitorVisits } from "@/hooks/useVisitors";
import { Users } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";

// Fetch a single guardian's full record by id
const useGuardian = (guardianId?: string | null) =>
  useQuery({
    queryKey: ["guardian", guardianId],
    enabled: !!guardianId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guardians")
        .select("*")
        .eq("id", guardianId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

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
            <VisitorIdSection
              schoolName={schoolName}
              schoolLogoUrl={previewSettings.school_logo_url}
              isRTL={isRTL}
              learners={learners}
            />
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
  learners,
}: {
  schoolName: string;
  schoolLogoUrl?: string;
  isRTL: boolean;
  learners: any[];
}) => {
  const { data: visits = [] } = useVisitorVisits("active");
  const { data: visitors = [] } = useVisitors();
  const [visitId, setVisitId] = useState<string>("");
  const [visitorId, setVisitorId] = useState<string>("");
  const [pickupLearnerId, setPickupLearnerId] = useState<string>("");
  const dayRef = useRef<HTMLDivElement>(null);
  const dayBackRef = useRef<HTMLDivElement>(null);
  const reusableRef = useRef<HTMLDivElement>(null);
  const reusableBackRef = useRef<HTMLDivElement>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const pickupBackRef = useRef<HTMLDivElement>(null);

  const visit = visits.find((v) => v.id === visitId);
  const visitor = visitors.find((v) => v.id === visitorId);
  const pickupLearner = learners.find((l) => l.id === pickupLearnerId);

  // Fetch full guardian record for richer auto-fill (email, district, address, relationship)
  const { data: guardianRecord } = useGuardian(pickupLearner?.guardian_id);

  // Auto-built visitor object from learner → guardian
  const guardianVisitor = useMemo(() => {
    if (!pickupLearner) return undefined;
    const name =
      guardianRecord?.full_name ||
      pickupLearner.guardian_name ||
      "Guardian (not on file)";
    const phone = guardianRecord?.phone || pickupLearner.guardian_phone || null;
    const relationship = guardianRecord?.relationship || "guardian";
    return {
      id: pickupLearner.guardian_id || `gp-${pickupLearner.id}`,
      full_name: name,
      phone,
      email: guardianRecord?.email || null,
      // Show relationship in the "Organisation" slot so it reads e.g. "Father / Parent"
      company: relationship.charAt(0).toUpperCase() + relationship.slice(1),
      // Use guardian district / national ID slot — falls back to a generated ref
      id_number:
        guardianRecord?.district ||
        (pickupLearner.guardian_id
          ? `GRD-${pickupLearner.guardian_id.slice(0, 8).toUpperCase()}`
          : null),
      photo_url: null,
      notes: guardianRecord?.address || null,
      is_recurring: true,
      created_at: guardianRecord?.created_at || new Date().toISOString(),
    } as any;
  }, [pickupLearner, guardianRecord]);

  // ============== VALIDATION ==============
  const pickupIssues = useMemo(() => {
    if (!pickupLearner) return [];
    const issues: { level: "error" | "warn"; msg: string }[] = [];
    if (!pickupLearner.guardian_id) {
      issues.push({ level: "error", msg: "No guardian on file for this learner. Add a guardian on the learner record before printing." });
    } else {
      if (!guardianRecord && pickupLearner.guardian_id) {
        // still loading or missing
      }
      if (!guardianVisitor?.phone) {
        issues.push({ level: "warn", msg: "Guardian phone is missing — verification calls will not be possible." });
      }
      if (!guardianRecord?.email) {
        issues.push({ level: "warn", msg: "Guardian email is missing — no electronic confirmation can be sent." });
      }
      if (!guardianRecord?.district && !guardianRecord?.address) {
        issues.push({ level: "warn", msg: "Guardian address / district is missing." });
      }
    }
    if (!pickupLearner.photo_url) {
      issues.push({ level: "warn", msg: "Learner has no photo on file — visual verification will be limited." });
    }
    return issues;
  }, [pickupLearner, guardianRecord, guardianVisitor]);

  const dayIssues = useMemo(() => {
    if (!visit) return [];
    const issues: { level: "error" | "warn"; msg: string }[] = [];
    const checkedIn = new Date(visit.check_in_at);
    const today = new Date();
    const sameDay =
      checkedIn.getFullYear() === today.getFullYear() &&
      checkedIn.getMonth() === today.getMonth() &&
      checkedIn.getDate() === today.getDate();
    if (visit.status === "checked_out") {
      issues.push({ level: "error", msg: "This visit has already been checked out — the day pass is no longer valid." });
    } else if (!sameDay) {
      issues.push({ level: "error", msg: `Day pass is from ${checkedIn.toLocaleDateString()} and has expired. Re-check the visitor in for today.` });
    }
    if (!visit.visitor_phone) issues.push({ level: "warn", msg: "Visitor phone is missing." });
    if (!visit.visitor_photo_url) issues.push({ level: "warn", msg: "No visitor photo captured at check-in." });
    if (!visit.host_name && !visit.host_staff_id) issues.push({ level: "warn", msg: "No host assigned for this visit." });
    if (!visit.purpose) issues.push({ level: "warn", msg: "Purpose of visit not recorded." });
    return issues;
  }, [visit]);

  const reusableIssues = useMemo(() => {
    if (!visitor) return [];
    const issues: { level: "error" | "warn"; msg: string }[] = [];
    if (!visitor.is_recurring) {
      issues.push({ level: "error", msg: "Selected visitor is not marked as recurring — issue a day pass instead." });
    }
    if (!visitor.phone) issues.push({ level: "warn", msg: "Phone number missing." });
    if (!visitor.id_number) issues.push({ level: "warn", msg: "Government ID number not on file." });
    if (!visitor.photo_url) issues.push({ level: "warn", msg: "No photo on file." });
    if (!visitor.company) issues.push({ level: "warn", msg: "Organisation / employer not recorded." });
    return issues;
  }, [visitor]);

  const hasBlockingIssue = (issues: { level: "error" | "warn"; msg: string }[]) =>
    issues.some((i) => i.level === "error");

  const exportCard = async (
    frontEl: React.RefObject<HTMLDivElement>,
    backEl: React.RefObject<HTMLDivElement>,
    name: string,
  ) => {
    if (!frontEl.current || !backEl.current) return;
    const safe = name.replace(/[^a-z0-9]/gi, "_");
    const zip = new JSZip();
    const front = await toPng(frontEl.current, { pixelRatio: 3, cacheBust: true, backgroundColor: "#ffffff" });
    const back = await toPng(backEl.current, { pixelRatio: 3, cacheBust: true, backgroundColor: "#ffffff" });
    zip.file(`${safe}_FRONT.png`, front.split(",")[1], { base64: true });
    zip.file(`${safe}_BACK.png`, back.split(",")[1], { base64: true });
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${safe}_VISITOR.zip`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* GUARDIAN PICKUP CARD — tied to a learner */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" />
            Authorised Pick-Up Pass
            <span className="text-xs font-normal text-muted-foreground">
              — for parent/guardian collecting a learner
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={pickupLearnerId} onValueChange={setPickupLearnerId}>
              <SelectTrigger className="sm:w-[360px]">
                <SelectValue placeholder="Select learner being collected…" />
              </SelectTrigger>
              <SelectContent>
                {learners.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.full_name}
                    {l.admission_number ? ` — ${l.admission_number}` : ""}
                    {l.guardian_name ? ` • ${l.guardian_name}` : " • (no guardian)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!pickupLearner || hasBlockingIssue(pickupIssues)}
              onClick={() => pickupLearner && exportCard(pickupRef, pickupBackRef, `${pickupLearner.full_name}_PICKUP`)}
            >
              <Download className="h-4 w-4 mr-2" />
              Print Pick-Up Pass (Front + Back)
            </Button>
          </div>
          {pickupLearner && (
            <ValidationBanner
              issues={pickupIssues}
              okLabel="Auto-filled from learner record. Guardian details verified."
              context="Guardian / pick-up validation"
            />
          )}
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <div ref={pickupRef} className="inline-block">
              {pickupLearner ? (
                <VisitorIDCard
                  visitor={guardianVisitor}
                  learner={pickupLearner}
                  schoolName={schoolName}
                  schoolLogoUrl={schoolLogoUrl}
                  isRTL={isRTL}
                  variant="guardian-pickup"
                  side="front"
                />
              ) : (
                <Placeholder label="Select a learner to issue a pick-up pass" />
              )}
            </div>
            <div ref={pickupBackRef} className="inline-block">
              {pickupLearner ? (
                <VisitorIDCard
                  visitor={guardianVisitor}
                  learner={pickupLearner}
                  schoolName={schoolName}
                  schoolLogoUrl={schoolLogoUrl}
                  isRTL={isRTL}
                  variant="guardian-pickup"
                  side="back"
                />
              ) : (
                <Placeholder label="Back side preview" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DAY PASS */}
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
            <Button disabled={!visit || hasBlockingIssue(dayIssues)} onClick={() => visit && exportCard(dayRef, dayBackRef, visit.visitor_name)}>
              <Download className="h-4 w-4 mr-2" />Print Day Pass (Front + Back)
            </Button>
          </div>
          {visit && (
            <ValidationBanner
              issues={dayIssues}
              okLabel="Day pass is valid for today. Visitor is currently on-site."
              context="Day pass validation"
            />
          )}
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <div ref={dayRef} className="inline-block">
              {visit ? (
                <VisitorIDCard visit={visit} schoolName={schoolName} schoolLogoUrl={schoolLogoUrl} isRTL={isRTL} variant="day-pass" side="front" />
              ) : (
                <Placeholder label="Check in a visitor to print a day pass" />
              )}
            </div>
            <div ref={dayBackRef} className="inline-block">
              {visit ? (
                <VisitorIDCard visit={visit} schoolName={schoolName} schoolLogoUrl={schoolLogoUrl} isRTL={isRTL} variant="day-pass" side="back" />
              ) : (
                <Placeholder label="Back side preview" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* REUSABLE */}
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
            <Button disabled={!visitor || hasBlockingIssue(reusableIssues)} onClick={() => visitor && exportCard(reusableRef, reusableBackRef, visitor.full_name)}>
              <Download className="h-4 w-4 mr-2" />Print Card (Front + Back)
            </Button>
          </div>
          {visitor && (
            <ValidationBanner
              issues={reusableIssues}
              okLabel="Visitor record is complete and authorised."
              context="Recurring visitor validation"
            />
          )}
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <div ref={reusableRef} className="inline-block">
              {visitor ? (
                <VisitorIDCard visitor={visitor} schoolName={schoolName} schoolLogoUrl={schoolLogoUrl} isRTL={isRTL} variant="reusable" side="front" />
              ) : (
                <Placeholder label="Add recurring visitors in the Visitors page" />
              )}
            </div>
            <div ref={reusableBackRef} className="inline-block">
              {visitor ? (
                <VisitorIDCard visitor={visitor} schoolName={schoolName} schoolLogoUrl={schoolLogoUrl} isRTL={isRTL} variant="reusable" side="back" />
              ) : (
                <Placeholder label="Back side preview" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IDCards;

// ===================== Validation banner =====================
type Issue = { level: "error" | "warn"; msg: string };

const ValidationBanner = ({
  issues,
  okLabel,
  context,
}: {
  issues: Issue[];
  okLabel: string;
  context: string;
}) => {
  if (issues.length === 0) {
    return (
      <Alert className="border-emerald-500/40 bg-emerald-500/5">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="text-emerald-700 text-sm">{context}</AlertTitle>
        <AlertDescription className="text-xs text-emerald-700/80">{okLabel}</AlertDescription>
      </Alert>
    );
  }
  const hasError = issues.some((i) => i.level === "error");
  return (
    <Alert variant={hasError ? "destructive" : "default"} className={!hasError ? "border-amber-500/50 bg-amber-500/5" : undefined}>
      {hasError ? (
        <ShieldAlert className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      )}
      <AlertTitle className={!hasError ? "text-amber-700 text-sm" : "text-sm"}>
        {hasError ? "Cannot print this card yet" : "Card can be printed — review warnings"}
        <span className="ml-2 text-xs font-normal opacity-70">({context})</span>
      </AlertTitle>
      <AlertDescription>
        <ul className={`mt-1 space-y-1 text-xs ${!hasError ? "text-amber-700/90" : ""}`}>
          {issues.map((issue, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-bold">
                {issue.level === "error" ? "✕" : "⚠"}
              </span>
              <span>{issue.msg}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
