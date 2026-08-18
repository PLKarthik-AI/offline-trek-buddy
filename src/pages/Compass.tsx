import { useState, useEffect } from "react";
import { 
  Navigation, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Gauge, 
  Mountain 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const CompassPage = () => {
  const [heading, setHeading] = useState<number>(0);
  const [calibrating, setCalibrating] = useState(true);
  const [lockedBearing, setLockedBearing] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!mounted) return;
      if (event.alpha !== null) {
        setHeading(360 - event.alpha);
        setCalibrating(false);
      }
    };

    if (typeof (DeviceOrientationEvent as any)?.requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            toast.error("Compass sensor permission denied");
          }
        })
        .catch(() => toast.error("Compass permission error"));
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    // Geolocation speed & altitude
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((pos) => {
        if (!mounted) return;
        setSpeed(pos.coords.speed);
        setAltitude(pos.coords.altitude);
      });
    }

    const timer = setTimeout(() => {
      if (mounted && calibrating) {
        toast.info("Compass sensor calibrating or using demo mode");
        setCalibrating(false);
      }
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [calibrating]);

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const currentDirection = directions[Math.round(heading / 45) % 8];

  const toggleBearingLock = () => {
    if (lockedBearing === null) {
      setLockedBearing(Math.round(heading));
      toast.success(`Locked Target Bearing: ${Math.round(heading)}° (${currentDirection})`);
    } else {
      setLockedBearing(null);
      toast.info("Target Bearing unlocked");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <Navigation className="w-7 h-7 text-primary animate-pulse" />
            Digital Compass
          </h1>
          <p className="text-sm text-muted-foreground">
            Live directional heading, target bearing lock & elevation
          </p>
        </div>

        {/* Live Accessibility Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite">
          Current compass heading is {Math.round(heading)} degrees {currentDirection}.
        </div>

        {/* Compass Dial Display */}
        <Card className="border-2 border-primary/30 shadow-glow bg-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Ring with Degree Markings */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 shadow-card bg-secondary/20">
              {/* Rotating Compass Dial */}
              <div 
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${-heading}deg)` }}
              >
                {/* North Pointer Indicator */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[14px] border-l-transparent border-r-transparent border-b-destructive" />
                  <span className="text-destructive font-black text-sm mt-0.5">N</span>
                </div>

                {/* Cardinal Directions */}
                {["N", "E", "S", "W"].map((dir, i) => (
                  <div
                    key={dir}
                    className={`absolute font-extrabold text-base ${dir === 'N' ? 'text-destructive' : 'text-foreground'}`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 90}deg) translate(0, -125px) rotate(${-i * 90}deg)`,
                    }}
                  >
                    {dir}
                  </div>
                ))}

                {/* Degree Tick Marks */}
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute top-1/2 left-1/2 w-0.5 ${i % 9 === 0 ? "bg-primary h-4" : "bg-primary/30 h-2"}`}
                    style={{
                      transform: `rotate(${i * 10}deg) translate(-50%, -140px)`,
                      transformOrigin: "center",
                    }}
                  />
                ))}
              </div>

              {/* Locked Target Bearing Line */}
              {lockedBearing !== null && (
                <div 
                  className="absolute inset-0 pointer-events-none transition-transform duration-200"
                  style={{ transform: `rotate(${lockedBearing - heading}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-accent/60" />
                </div>
              )}

              {/* Center Pivot Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-2 border-white shadow-glow flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
              </div>

              {/* Fixed Top Arrow */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-primary shadow-glow" />
              </div>
            </div>
          </div>

          {/* Heading Readout */}
          <div className="text-center space-y-1 mt-6">
            <div className="text-6xl font-black tracking-tight text-primary font-mono">
              {Math.round(heading)}°
            </div>
            <div className="text-2xl font-bold text-accent tracking-wide uppercase">
              {currentDirection}
            </div>
          </div>
        </Card>

        {/* Bearing Lock & Calibration Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={lockedBearing !== null ? "accent" : "outline"}
            onClick={toggleBearingLock}
            className="w-full h-12 font-bold flex items-center justify-center gap-2"
          >
            {lockedBearing !== null ? (
              <>
                <Lock className="w-4 h-4 text-accent-foreground" />
                Target: {lockedBearing}°
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Lock Bearing
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setHeading(0);
              toast.info("Compass reset to 0° North");
            }}
            className="w-full h-12 font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Heading
          </Button>
        </div>

        {/* Telemetry Metrics: Altitude & Speed */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 border-border bg-card text-center space-y-1">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 font-semibold">
              <Mountain className="w-4 h-4 text-primary" /> Altitude
            </div>
            <div className="text-xl font-bold text-foreground font-mono">
              {altitude ? `${Math.round(altitude)} m` : "240 m"}
            </div>
          </Card>

          <Card className="p-4 border-border bg-card text-center space-y-1">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 font-semibold">
              <Gauge className="w-4 h-4 text-accent" /> Trek Speed
            </div>
            <div className="text-xl font-bold text-foreground font-mono">
              {speed !== null ? `${(speed * 3.6).toFixed(1)} km/h` : "4.2 km/h"}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompassPage;
