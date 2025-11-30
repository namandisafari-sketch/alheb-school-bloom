import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  Users,
  Shield,
  Star,
};

const Landing = () => {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const hero = settings?.landing_hero;
  const features = settings?.landing_features;
  const stats = settings?.landing_stats;
  const contact = settings?.landing_contact;
  const theme = settings?.landing_theme;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: theme?.primary_color || "hsl(142, 76%, 36%)" }}
              >
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-semibold">
                {hero?.school_name?.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth">
                <Button style={{ background: theme?.primary_color }}>
                  {hero?.cta_text || "Get Started"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        style={{ background: theme?.hero_bg_gradient }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {hero?.school_name}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-4 font-medium">
            {hero?.tagline}
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {hero?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={hero?.cta_link || "/auth"}>
              <Button size="lg" className="bg-white text-green-700 hover:bg-white/90 font-semibold px-8">
                {hero?.cta_text || "Apply Now"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Parent Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {theme?.show_stats && stats?.items && (
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.items.map((stat, index) => (
                <div key={index} className="text-center">
                  <p 
                    className="text-4xl font-bold mb-1"
                    style={{ color: theme?.primary_color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {theme?.show_features && features?.items && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-12">
              {features.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.items.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || BookOpen;
                return (
                  <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                        style={{ background: `${theme?.primary_color}20` }}
                      >
                        <IconComponent 
                          className="h-6 w-6" 
                          style={{ color: theme?.primary_color }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {theme?.show_contact && contact && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-12">
              {contact.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground text-sm">{contact.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground text-sm">{contact.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground text-sm">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-muted-foreground text-sm">{contact.hours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {hero?.school_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
