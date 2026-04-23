import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { useIdCardSettings, useUpdateIdCardSettings, uploadSignature, IdCardSettings } from "@/hooks/useIdCardSettings";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Eye, Palette, Layout, Phone, BarChart3, CreditCard, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const SiteSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { data: idCardSettings } = useIdCardSettings();
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
      toast({ title: "Uploaded", description: "Signature saved" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setLoad(false);
    }
  };

  const [hero, setHero] = useState({
    school_name: "",
    tagline: "",
    description: "",
    cta_text: "",
    cta_link: "",
  });

  const [features, setFeatures] = useState({
    title: "",
    items: [] as any[],
  });

  const [stats, setStats] = useState({
    items: [] as any[],
  });

  const [contact, setContact] = useState({
    title: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
  });

  const [theme, setTheme] = useState({
    primary_color: "",
    hero_bg_gradient: "",
    show_stats: true,
    show_features: true,
    show_contact: true,
  });

  useEffect(() => {
    if (settings) {
      if (settings.landing_hero) setHero(settings.landing_hero);
      if (settings.landing_features) setFeatures(settings.landing_features);
      if (settings.landing_stats) setStats(settings.landing_stats);
      if (settings.landing_contact) setContact(settings.landing_contact);
      if (settings.landing_theme) setTheme(settings.landing_theme);
    }
  }, [settings]);

  const handleSave = async (key: string, value: any) => {
    try {
      await updateSetting.mutateAsync({ key, value });
      toast({ title: "Saved", description: "Settings updated successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const updateFeatureItem = (index: number, field: string, value: string) => {
    const newItems = [...features.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFeatures({ ...features, items: newItems });
  };

  const updateStatItem = (index: number, field: string, value: string) => {
    const newItems = [...stats.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setStats({ ...stats, items: newItems });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Site Settings" subtitle="Manage landing page content">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Site Settings"
      subtitle="Customize your landing page appearance and content"
    >
      <div className="space-y-6">
        {/* Preview Button */}
        <div className="flex justify-end">
          <Link to="/welcome" target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview Landing Page
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
            <TabsTrigger value="hero" className="gap-2">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger value="idcards" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">ID Cards</span>
            </TabsTrigger>
          </TabsList>

          {/* ID Cards Tab */}
          <TabsContent value="idcards">
            <Card>
              <CardHeader>
                <CardTitle>ID Card Signatures & Branding</CardTitle>
                <CardDescription>
                  Upload Director and Head Teacher signatures — they will appear on every generated ID card.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Director Name</Label>
                    <Input
                      value={idCard.director_name}
                      onChange={(e) => setIdCard({ ...idCard, director_name: e.target.value })}
                      placeholder="e.g. Sheikh Ahmed"
                    />
                    <Label>Director Signature</Label>
                    <div className="flex items-center gap-3">
                      {idCard.director_signature_url ? (
                        <img src={idCard.director_signature_url} alt="director sig" className="h-14 max-w-[160px] object-contain border rounded bg-white p-1" />
                      ) : (
                        <div className="h-14 w-32 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">No signature</div>
                      )}
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleSignatureUpload(e.target.files[0], "director")}
                        />
                        <Button asChild variant="outline" size="sm">
                          <span>{uploadingDir ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />} Upload</span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Head Teacher Name</Label>
                    <Input
                      value={idCard.head_teacher_name}
                      onChange={(e) => setIdCard({ ...idCard, head_teacher_name: e.target.value })}
                      placeholder="e.g. Mrs. Fatima"
                    />
                    <Label>Head Teacher Signature</Label>
                    <div className="flex items-center gap-3">
                      {idCard.head_teacher_signature_url ? (
                        <img src={idCard.head_teacher_signature_url} alt="head sig" className="h-14 max-w-[160px] object-contain border rounded bg-white p-1" />
                      ) : (
                        <div className="h-14 w-32 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">No signature</div>
                      )}
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleSignatureUpload(e.target.files[0], "head_teacher")}
                        />
                        <Button asChild variant="outline" size="sm">
                          <span>{uploadingHead ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />} Upload</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>School Logo URL (optional)</Label>
                  <Input
                    value={idCard.school_logo_url}
                    onChange={(e) => setIdCard({ ...idCard, school_logo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Back-side Policy (English)</Label>
                    <Textarea rows={3} value={idCard.back_policy} onChange={(e) => setIdCard({ ...idCard, back_policy: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Back-side Policy (Arabic)</Label>
                    <Textarea rows={3} dir="rtl" value={idCard.back_policy_ar} onChange={(e) => setIdCard({ ...idCard, back_policy_ar: e.target.value })} />
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    await updateIdCardSettings.mutateAsync(idCard);
                    toast({ title: "Saved", description: "ID card settings updated" });
                  }}
                  disabled={updateIdCardSettings.isPending}
                  className="gap-2"
                >
                  {updateIdCardSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save ID Card Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Main banner content for your landing page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input
                    value={hero.school_name}
                    onChange={(e) => setHero({ ...hero, school_name: e.target.value })}
                    placeholder="Your School Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={hero.tagline}
                    onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                    placeholder="A short catchy tagline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={hero.description}
                    onChange={(e) => setHero({ ...hero, description: e.target.value })}
                    placeholder="Describe your school..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CTA Button Text</Label>
                    <Input
                      value={hero.cta_text}
                      onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                      placeholder="Apply Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Button Link</Label>
                    <Input
                      value={hero.cta_link}
                      onChange={(e) => setHero({ ...hero, cta_link: e.target.value })}
                      placeholder="/auth"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSave("landing_hero", hero)}
                  disabled={updateSetting.isPending}
                  className="gap-2"
                >
                  {updateSetting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Hero
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Features Section</CardTitle>
                <CardDescription>Highlight what makes your school special</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={features.title}
                    onChange={(e) => setFeatures({ ...features, title: e.target.value })}
                    placeholder="Why Choose Us?"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Feature Items</Label>
                  {features.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 p-3 border rounded-lg">
                      <Input
                        value={item.icon}
                        onChange={(e) => updateFeatureItem(index, "icon", e.target.value)}
                        placeholder="Icon name"
                      />
                      <Input
                        value={item.title}
                        onChange={(e) => updateFeatureItem(index, "title", e.target.value)}
                        placeholder="Feature title"
                      />
                      <Input
                        value={item.description}
                        onChange={(e) => updateFeatureItem(index, "description", e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleSave("landing_features", features)}
                  disabled={updateSetting.isPending}
                  className="gap-2"
                >
                  {updateSetting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Features
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistics Section</CardTitle>
                <CardDescription>Display impressive numbers about your school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Statistics Items</Label>
                  {stats.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 p-3 border rounded-lg">
                      <Input
                        value={item.value}
                        onChange={(e) => updateStatItem(index, "value", e.target.value)}
                        placeholder="e.g. 500+"
                      />
                      <Input
                        value={item.label}
                        onChange={(e) => updateStatItem(index, "label", e.target.value)}
                        placeholder="e.g. Students"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleSave("landing_stats", stats)}
                  disabled={updateSetting.isPending}
                  className="gap-2"
                >
                  {updateSetting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Statistics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How visitors can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={contact.title}
                    onChange={(e) => setContact({ ...contact, title: e.target.value })}
                    placeholder="Contact Us"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    placeholder="123 School Road, City"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+256 700 123 456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="info@school.edu"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Office Hours</Label>
                  <Input
                    value={contact.hours}
                    onChange={(e) => setContact({ ...contact, hours: e.target.value })}
                    placeholder="Monday - Friday: 8:00 AM - 5:00 PM"
                  />
                </div>
                <Button
                  onClick={() => handleSave("landing_contact", contact)}
                  disabled={updateSetting.isPending}
                  className="gap-2"
                >
                  {updateSetting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Contact
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Visibility</CardTitle>
                <CardDescription>Customize colors and section visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color (HSL)</Label>
                  <Input
                    value={theme.primary_color}
                    onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                    placeholder="hsl(142, 76%, 36%)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use HSL format: hsl(hue, saturation%, lightness%)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Hero Background Gradient</Label>
                  <Input
                    value={theme.hero_bg_gradient}
                    onChange={(e) => setTheme({ ...theme, hero_bg_gradient: e.target.value })}
                    placeholder="linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 60%, 25%) 100%)"
                  />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <Label>Section Visibility</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Statistics</p>
                      <p className="text-sm text-muted-foreground">Display stats section</p>
                    </div>
                    <Switch
                      checked={theme.show_stats}
                      onCheckedChange={(checked) => setTheme({ ...theme, show_stats: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Features</p>
                      <p className="text-sm text-muted-foreground">Display features section</p>
                    </div>
                    <Switch
                      checked={theme.show_features}
                      onCheckedChange={(checked) => setTheme({ ...theme, show_features: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Contact</p>
                      <p className="text-sm text-muted-foreground">Display contact section</p>
                    </div>
                    <Switch
                      checked={theme.show_contact}
                      onCheckedChange={(checked) => setTheme({ ...theme, show_contact: checked })}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSave("landing_theme", theme)}
                  disabled={updateSetting.isPending}
                  className="gap-2"
                >
                  {updateSetting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Theme
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SiteSettings;
