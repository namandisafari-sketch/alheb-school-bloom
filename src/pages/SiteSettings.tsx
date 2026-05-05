import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useIdCardSettings,
  useUpdateIdCardSettings,
  uploadSignature,
  IdCardSettings,
} from "@/hooks/useIdCardSettings";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2, Save, Upload, GraduationCap, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAcademicSettings, useUpdateAcademicSettings, AcademicSettings } from "@/hooks/useAcademicSettings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DEFAULT_ID_CARD: IdCardSettings = {
  director_name: "",
  director_signature_url: "",
  head_teacher_name: "",
  head_teacher_signature_url: "",
  school_logo_url: "",
  school_stamp_url: "",
  back_policy: "",
  back_policy_ar: "",
  logo_size_report: 96,
  logo_size_id: 44,
  signature_height_report: 32,
  signature_height_id: 22,
  stamp_size_report: 80,
  barcode_height: 12,
};

const SiteSettings = () => {
  const { t, isRTL } = useLanguage();
  const { data: idCardSettings, isLoading: isIdLoading } = useIdCardSettings();
  const { data: academicSettings, isLoading: isAcademicLoading } = useAcademicSettings();
  const updateIdCardSettings = useUpdateIdCardSettings();
  const updateAcademicSettings = useUpdateAcademicSettings();
  const [idCard, setIdCard] = useState<IdCardSettings>(DEFAULT_ID_CARD);
  const [academic, setAcademic] = useState<AcademicSettings | null>(null);
  const [uploadingDir, setUploadingDir] = useState(false);
  const [uploadingHead, setUploadingHead] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);

  useEffect(() => {
    if (idCardSettings) setIdCard(idCardSettings);
  }, [idCardSettings]);

  useEffect(() => {
    if (academicSettings) setAcademic(academicSettings);
  }, [academicSettings]);

  const handleSignatureUpload = async (file: File, type: "director" | "head_teacher") => {
    const setLoad = type === "director" ? setUploadingDir : setUploadingHead;
    setLoad(true);
    try {
      const url = await uploadSignature(file, type);
      const next = {
        ...idCard,
        [type === "director" ? "director_signature_url" : "head_teacher_signature_url"]: url,
      };
      setIdCard(next);
      await updateIdCardSettings.mutateAsync(next);
      toast({ title: t("saved"), description: t("settingsUpdated") });
    } catch (e: any) {
      toast({ title: t("error"), description: e.message, variant: "destructive" });
    } finally {
      setLoad(false);
    }
  };

  const handleAssetUpload = async (file: File, kind: "logo" | "stamp") => {
    const setLoad = kind === "logo" ? setUploadingLogo : setUploadingStamp;
    setLoad(true);
    try {
      const url = await uploadSignature(file, kind === "logo" ? "director" : "head_teacher");
      const next = {
        ...idCard,
        [kind === "logo" ? "school_logo_url" : "school_stamp_url"]: url,
      };
      setIdCard(next);
      await updateIdCardSettings.mutateAsync(next);
      toast({ title: t("saved"), description: t("settingsUpdated") });
    } catch (e: any) {
      toast({ title: t("error"), description: e.message, variant: "destructive" });
    } finally {
      setLoad(false);
    }
  };

  if (isIdLoading || isAcademicLoading) {
    return (
      <DashboardLayout title={t("systemSettings")} subtitle={t("idCards")}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={t("systemSettings")}
      subtitle={t("idCardSignaturesBranding")}
    >
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Academic Settings</CardTitle>
            </div>
            <CardDescription>Configure the active academic year and school terms.</CardDescription>
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <RefreshCw className={cn("h-4 w-4 text-primary", academic?.is_automatic && "animate-spin")} />
                </div>
                <div>
                  <p className="text-sm font-bold">Automatic Sync</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Auto-detect year & term</p>
                </div>
              </div>
              <Switch 
                checked={academic?.is_automatic} 
                onCheckedChange={(v) => setAcademic(academic ? {...academic, is_automatic: v} : null)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {academic && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Active Academic Year</Label>
                    <Input 
                      type="number"
                      disabled={academic.is_automatic}
                      value={academic.current_year}
                      onChange={(e) => setAcademic({...academic, current_year: parseInt(e.target.value)})}
                    />
                    {academic.is_automatic && <p className="text-[10px] text-primary font-bold italic">Automatically detected as {new Date().getFullYear()}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Terms</Label>
                    <Select 
                      value={academic.number_of_terms.toString()}
                      onValueChange={(v) => {
                        const count = parseInt(v);
                        let newTerms = [...academic.terms];
                        if (count > newTerms.length) {
                          for (let i = newTerms.length; i < count; i++) {
                            const roman = i === 0 ? "I" : i === 1 ? "II" : i === 2 ? "III" : i === 3 ? "IV" : (i+1).toString();
                            newTerms.push({ id: `term_${i+1}`, name: `Term ${roman}`, start_month: "", end_month: "" });
                          }
                        } else {
                          newTerms = newTerms.slice(0, count);
                        }
                        setAcademic({...academic, number_of_terms: count, terms: newTerms});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of terms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n} Terms</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Active Term</Label>
                    <Select 
                      disabled={academic.is_automatic}
                      value={academic.current_term_id}
                      onValueChange={(v) => setAcademic({...academic, current_term_id: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select active term" />
                      </SelectTrigger>
                      <SelectContent>
                        {academic.terms.map(term => (
                          <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {academic.is_automatic && <p className="text-[10px] text-primary font-bold italic">Term auto-switched based on today's date</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold">Term Schedule</Label>
                  <div className="grid gap-4">
                    {academic.terms.map((term, idx) => (
                      <div key={term.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm uppercase tracking-wider text-primary">{term.name}</span>
                          <span className="text-[10px] font-medium text-slate-400">Term {idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Start Month</Label>
                            <Input 
                              value={term.start_month}
                              onChange={(e) => {
                                const newTerms = [...academic.terms];
                                newTerms[idx].start_month = e.target.value;
                                setAcademic({...academic, terms: newTerms});
                              }}
                              placeholder="e.g. February"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">End Month</Label>
                            <Input 
                              value={term.end_month}
                              onChange={(e) => {
                                const newTerms = [...academic.terms];
                                newTerms[idx].end_month = e.target.value;
                                setAcademic({...academic, terms: newTerms});
                              }}
                              placeholder="e.g. May"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    await updateAcademicSettings.mutateAsync(academic);
                    toast({ title: t("saved"), description: "Academic settings updated successfully." });
                  }}
                  disabled={updateAcademicSettings.isPending}
                  className="gap-2"
                >
                  {updateAcademicSettings.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarIcon className="h-4 w-4" />
                  )}
                  Save Academic Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default SiteSettings;
