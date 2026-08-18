import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  Sun, 
  Moon, 
  Eye, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Battery, 
  ArrowLeft 
} from "lucide-react";
import { toast } from "sonner";

interface NavbarProps {
  theme: "dark" | "light" | "high-contrast";
  setTheme: (theme: "dark" | "light" | "high-contrast") => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar = ({ theme, setTheme, soundEnabled, setSoundEnabled }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Online mode active");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.info("Offline mode active - All survival features remain available");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Battery status API if supported
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("high-contrast");
    else setTheme("dark");
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-5 h-5 text-accent" />;
    if (theme === "light") return <Sun className="w-5 h-5 text-primary" />;
    return <Eye className="w-5 h-5 text-primary animate-pulse" />;
  };

  const getThemeName = () => {
    if (theme === "dark") return "Dark Tactical";
    if (theme === "light") return "Light High-Vis";
    return "High Contrast (Outdoor)";
  };

  return (
    <header 
      role="banner" 
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border shadow-card transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isHome && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              aria-label="Back to home screen"
              className="h-11 w-11 rounded-full hover:bg-secondary border border-border/50"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
          )}

          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
            aria-label="SurviveIt Home"
          >
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/40 group-hover:scale-105 transition-transform shadow-glow">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-foreground block leading-none">
                SurviveIt
              </span>
              <span className="text-[10px] uppercase font-semibold text-primary tracking-wider block mt-0.5">
                Offline Buddy
              </span>
            </div>
          </button>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2">
          {/* Online/Offline Status Indicator */}
          <div 
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isOnline 
                ? "bg-primary/10 text-primary border-primary/30" 
                : "bg-accent/10 text-accent border-accent/30"
            }`}
            aria-label={`Status: ${isOnline ? "Online" : "Offline"}`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? "Online" : "Offline Ready"}</span>
          </div>

          {/* Battery Status if supported */}
          {batteryLevel !== null && (
            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-secondary border border-border"
              title="Device Battery Level"
            >
              <Battery className="w-3.5 h-3.5 text-primary" />
              <span>{batteryLevel}%</span>
            </div>
          )}

          {/* Sound Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              toast.info(nextState ? "Sound FX Enabled" : "Sound FX Muted");
            }}
            aria-label={soundEnabled ? "Mute audio feedback" : "Enable audio feedback"}
            title={soundEnabled ? "Audio On" : "Audio Muted"}
            className="h-11 w-11 rounded-xl border border-border hover:bg-secondary"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>

          {/* Theme Switcher Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleTheme();
              toast.info(`Theme: ${getThemeName()}`);
            }}
            aria-label={`Current theme: ${getThemeName()}. Click to toggle theme.`}
            title={`Switch Theme (Current: ${getThemeName()})`}
            className="h-11 w-11 rounded-xl border border-border hover:bg-secondary"
          >
            {getThemeIcon()}
          </Button>
        </div>
      </div>
    </header>
  );
};
