import { useNavigate } from "react-router-dom";
import { FeatureCard } from "@/components/FeatureCard";
import { 
  MapPin, 
  Navigation, 
  BookOpen, 
  AlertTriangle, 
  ClipboardCheck, 
  Zap, 
  Sun, 
  ShieldCheck, 
  Radio 
} from "lucide-react";

export const IndexPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Offline Map & Waypoints",
      description: "Live GPS tracking, waypoint recorder & distance calculations",
      route: "/map",
      badge: "GPS Active"
    },
    {
      icon: Navigation,
      title: "Digital Compass",
      description: "Live directional heading, target bearing lock & elevation",
      route: "/compass",
      badge: "Sensor Live"
    },
    {
      icon: Zap,
      title: "Flashlight & Signals",
      description: "Screen torch, red night-vision light & SOS audio beacon",
      route: "/flashlight",
      badge: "Torch / Audio"
    },
    {
      icon: Sun,
      title: "Sun, Moon & Weather",
      description: "Daylight calculator, moon phase visibility & wind chill index",
      route: "/weather",
      badge: "Astro / Thermal"
    },
    {
      icon: BookOpen,
      title: "Survival Field Guides",
      description: "Water purification, shelter building & trauma first aid",
      route: "/guide",
      badge: "5 Manuals"
    },
    {
      icon: AlertTriangle,
      title: "Emergency SOS Beacon",
      description: "Instant SMS distress dispatch, siren alarm & strobe flash",
      route: "/sos",
      badge: "Emergency"
    },
    {
      icon: ClipboardCheck,
      title: "Trip Gear Checklist",
      description: "Pack smart with category breakdown & readiness tracker",
      route: "/checklist",
      badge: "Checklist"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest shadow-glow">
            <ShieldCheck className="w-4 h-4" /> 100% Offline Wilderness Toolkit
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
            Survive<span className="text-primary">It</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Essential navigation, emergency beaconing, survival manuals, and environmental tools — operating entirely without internet or cellular connectivity.
          </p>
        </section>

        {/* Feature Tools Grid */}
        <section aria-label="Survival Tools Navigation" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
              onClick={() => navigate(feature.route)}
            />
          ))}
        </section>

        {/* Safety Disclaimer Banner */}
        <section className="p-4 sm:p-5 rounded-2xl bg-card border-2 border-accent/40 shadow-card flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/10 text-accent flex-shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1 text-sm">
            <h2 className="font-bold text-accent text-base">Wilderness Safety First</h2>
            <p className="text-muted-foreground leading-relaxed">
              This application is designed as an auxiliary survival aid. Always file a trip plan with local rangers or relatives, carry physical topographic paper maps, and maintain primary emergency signaling gear when exploring remote wilderness areas.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IndexPage;
