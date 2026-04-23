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
import { Loader2, Save, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SiteSettings = () => {
  const { t, isRTL } = useLanguage();
  const { data: idCardSettings, isLoading } = useIdCardSettings();
  const updateIdCardSettings = useUpdateIdCardSettings();
  const [idCard, setIdCard] = useState<IdCardSettings>({
    director_name: "",
    director_signature_url: "",
    head_teacher_name: "",
    head_teacher_signature_url: "",
    school_logo_url: "",
    back_policy: "",
    back_policy_ar: "",
  });
  const [uploadingDir, setUploadingDir] = useState(false);
  const [uploadingHead, setUploadingHead] = useState(false);

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

            <div className="space-y-2">
              <Label>{t("schoolLogoUrl")}</Label>
              <Input
                value={idCard.school_logo_url}
                onChange={(e) => setIdCard({ ...idCard, school_logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default SiteSettings;
