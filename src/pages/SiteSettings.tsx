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
import { Loader2, Save, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
};

const SiteSettings = () => {
  const { t, isRTL } = useLanguage();
  const { data: idCardSettings, isLoading } = useIdCardSettings();
  const updateIdCardSettings = useUpdateIdCardSettings();
  const [idCard, setIdCard] = useState<IdCardSettings>(DEFAULT_ID_CARD);
  const [uploadingDir, setUploadingDir] = useState(false);
  const [uploadingHead, setUploadingHead] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);

  useEffect(() => {
    if (idCardSettings) setIdCard(idCardSettings);
  }, [idCardSettings]);

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

  if (isLoading) {
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
        <Card>
          <CardHeader>
            <CardTitle>{t("idCardSignaturesBranding")}</CardTitle>
            <CardDescription>{t("idCardSettingsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>{t("directorName")}</Label>
                <Input
                  value={idCard.director_name}
                  onChange={(e) => setIdCard({ ...idCard, director_name: e.target.value })}
                />
                <Label>{t("directorSignature")}</Label>
                <div className="flex items-center gap-3 flex-wrap">
                  {idCard.director_signature_url ? (
                    <img
                      src={idCard.director_signature_url}
                      alt="director sig"
                      className="h-14 max-w-[160px] object-contain border rounded bg-white p-1"
                    />
                  ) : (
                    <div className="h-14 w-32 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">
                      {t("noSignature")}
                    </div>
                  )}
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleSignatureUpload(e.target.files[0], "director")
                      }
                    />
                    <Button asChild variant="outline" size="sm">
                      <span className="cursor-pointer">
                        {uploadingDir ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}{" "}
                        {t("upload")}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <Label>{t("headTeacherName")}</Label>
                <Input
                  value={idCard.head_teacher_name}
                  onChange={(e) => setIdCard({ ...idCard, head_teacher_name: e.target.value })}
                />
                <Label>{t("headTeacherSignature")}</Label>
                <div className="flex items-center gap-3 flex-wrap">
                  {idCard.head_teacher_signature_url ? (
                    <img
                      src={idCard.head_teacher_signature_url}
                      alt="head sig"
                      className="h-14 max-w-[160px] object-contain border rounded bg-white p-1"
                    />
                  ) : (
                    <div className="h-14 w-32 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">
                      {t("noSignature")}
                    </div>
                  )}
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleSignatureUpload(e.target.files[0], "head_teacher")
                      }
                    />
                    <Button asChild variant="outline" size="sm">
                      <span className="cursor-pointer">
                        {uploadingHead ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}{" "}
                        {t("upload")}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* School logo + stamp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
              <div className="space-y-3">
                <Label>School Logo / Crest</Label>
                <div className="flex items-center gap-3 flex-wrap">
                  {idCard.school_logo_url ? (
                    <img
                      src={idCard.school_logo_url}
                      alt="logo"
                      className="h-20 w-20 object-contain border rounded bg-white p-1"
                    />
                  ) : (
                    <div className="h-20 w-20 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">
                      No logo
                    </div>
                  )}
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleAssetUpload(e.target.files[0], "logo")
                      }
                    />
                    <Button asChild variant="outline" size="sm">
                      <span className="cursor-pointer">
                        {uploadingLogo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}{" "}
                        Upload Logo
                      </span>
                    </Button>
                  </label>
                </div>
                <Input
                  value={idCard.school_logo_url}
                  onChange={(e) => setIdCard({ ...idCard, school_logo_url: e.target.value })}
                  placeholder="Or paste URL https://..."
                />
              </div>

              <div className="space-y-3">
                <Label>Official School Stamp</Label>
                <div className="flex items-center gap-3 flex-wrap">
                  {idCard.school_stamp_url ? (
                    <img
                      src={idCard.school_stamp_url}
                      alt="stamp"
                      className="h-20 max-w-[200px] object-contain border rounded bg-white p-1"
                    />
                  ) : (
                    <div className="h-20 w-32 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">
                      No stamp
                    </div>
                  )}
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleAssetUpload(e.target.files[0], "stamp")
                      }
                    />
                    <Button asChild variant="outline" size="sm">
                      <span className="cursor-pointer">
                        {uploadingStamp ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}{" "}
                        Upload Stamp
                      </span>
                    </Button>
                  </label>
                </div>
                <Input
                  value={idCard.school_stamp_url}
                  onChange={(e) => setIdCard({ ...idCard, school_stamp_url: e.target.value })}
                  placeholder="Or paste URL https://..."
                />
              </div>
            </div>

            {/* Size controls — fitted via object-contain so nothing crops */}
            <div className="space-y-5 pt-4 border-t">
              <div>
                <h3 className="font-semibold text-sm mb-1">Print Size Controls</h3>
                <p className="text-xs text-muted-foreground">
                  All assets auto-fit without cropping. Adjust the on-page display size below.
                </p>
              </div>

              <SizeSlider
                label="Logo size on Report Card (px)"
                value={idCard.logo_size_report}
                min={48}
                max={160}
                onChange={(v) => setIdCard({ ...idCard, logo_size_report: v })}
              />
              <SizeSlider
                label="Logo size on ID Card (px)"
                value={idCard.logo_size_id}
                min={28}
                max={80}
                onChange={(v) => setIdCard({ ...idCard, logo_size_id: v })}
              />
              <SizeSlider
                label="Headteacher signature on Report Card (height px)"
                value={idCard.signature_height_report}
                min={20}
                max={80}
                onChange={(v) => setIdCard({ ...idCard, signature_height_report: v })}
              />
              <SizeSlider
                label="Signatures on ID Card (height px)"
                value={idCard.signature_height_id}
                min={14}
                max={40}
                onChange={(v) => setIdCard({ ...idCard, signature_height_id: v })}
              />
              <SizeSlider
                label="Official stamp on Report Card (height px)"
                value={idCard.stamp_size_report}
                min={48}
                max={160}
                onChange={(v) => setIdCard({ ...idCard, stamp_size_report: v })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>{t("backPolicyEn")}</Label>
                <Textarea
                  rows={3}
                  value={idCard.back_policy}
                  onChange={(e) => setIdCard({ ...idCard, back_policy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("backPolicyAr")}</Label>
                <Textarea
                  rows={3}
                  dir="rtl"
                  value={idCard.back_policy_ar}
                  onChange={(e) => setIdCard({ ...idCard, back_policy_ar: e.target.value })}
                />
              </div>
            </div>

            <Button
              onClick={async () => {
                await updateIdCardSettings.mutateAsync(idCard);
                toast({ title: t("saved"), description: t("settingsUpdated") });
              }}
              disabled={updateIdCardSettings.isPending}
              className="gap-2"
            >
              {updateIdCardSettings.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t("saveSettings")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const SizeSlider = ({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <span className="text-sm font-mono text-muted-foreground">{value}px</span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={1}
      onValueChange={([v]) => onChange(v)}
    />
  </div>
);

export default SiteSettings;
