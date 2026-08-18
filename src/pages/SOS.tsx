import { useState, useEffect, useRef } from "react";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Copy, 
  Volume2, 
  VolumeX, 
  Eye, 
  ShieldAlert, 
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SOSPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sirenAudio, setSirenAudio] = useState(false);
  const [visualFlash, setVisualFlash] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  // Emergency Siren Synth (Oscillating High Pitch Siren 600Hz <-> 1400Hz)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sirenAudio) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.4, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      let high = false;
      interval = setInterval(() => {
        if (!ctx) return;
        high = !high;
        osc.frequency.setValueAtTime(high ? 1400 : 700, ctx.currentTime);
      }, 350);

      return () => {
        clearInterval(interval);
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      };
    }
  }, [sirenAudio]);

  const getLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
          toast.success("Emergency GPS location acquired");
        },
        () => {
          setLoading(false);
          toast.error("GPS Signal search timed out. Make sure location is turned on.");
          setLocation({ lat: 28.6139, lng: 77.2090 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLoading(false);
      setLocation({ lat: 28.6139, lng: 77.2090 });
    }
  };

  const triggerSMS = () => {
    if (!location) {
      toast.error("Location unavailable");
      return;
    }
    const message = `EMERGENCY SOS! I need urgent rescue help. My exact GPS coordinates: Latitude ${location.lat.toFixed(6)}, Longitude ${location.lng.toFixed(6)}. View Location: https://maps.google.com/?q=${location.lat},${location.lng}`;
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    toast.success("Opening SMS application...");
  };

  const copyCoordinates = () => {
    if (!location) return;
    const text = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    toast.success("Coordinates copied to clipboard!");
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-4 sm:p-6 transition-colors duration-200 ${
      visualFlash ? "animate-strobe-flash" : "gradient-adventure"
    }`}>
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-full bg-destructive/20 border-2 border-destructive/50 shadow-glow animate-pulse">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-destructive">
            EMERGENCY SOS BEACON
          </h1>
          <p className="text-sm text-muted-foreground">
            Activate emergency SMS, acoustic alarm siren & visual beacon
          </p>
        </div>

        {/* Primary SOS SMS Trigger Button */}
        <Card className="border-4 border-destructive shadow-[0_0_40px_rgba(239,68,68,0.4)] bg-card overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <Button
              variant="destructive"
              onClick={triggerSMS}
              disabled={!location}
              className="w-full h-20 text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow active:scale-95 transition-transform"
            >
              <Phone className="w-8 h-8 animate-bounce" />
              SEND EMERGENCY SOS SMS
            </Button>
            <p className="text-xs text-center text-muted-foreground font-medium">
              Opens your device's SMS app pre-filled with your live GPS location link for search & rescue authorities.
            </p>
          </CardContent>
        </Card>

        {/* Acoustic Siren & Visual Beacon Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={sirenAudio ? "destructive" : "outline"}
            onClick={() => {
              setSirenAudio(!sirenAudio);
              if (!sirenAudio) toast.warning("Acoustic Siren Alarm sounding!");
            }}
            className="h-14 font-bold text-sm flex flex-col items-center justify-center gap-1 border-2 border-border"
          >
            {sirenAudio ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
            <span>{sirenAudio ? "Stop Audio Siren" : "Start Audio Siren"}</span>
          </Button>

          <Button
            variant={visualFlash ? "accent" : "outline"}
            onClick={() => {
              setVisualFlash(!visualFlash);
              if (!visualFlash) toast.warning("Screen Strobe Flash active!");
            }}
            className="h-14 font-bold text-sm flex flex-col items-center justify-center gap-1 border-2 border-border"
          >
            <Eye className="w-5 h-5" />
            <span>{visualFlash ? "Stop Screen Flash" : "Start Screen Flash"}</span>
          </Button>
        </div>

        {/* GPS Coordinates Box */}
        <Card className="border-border bg-card">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Current Coordinates
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={getLocation} className="h-7 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" /> Refresh GPS
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {loading ? (
              <p className="text-center text-muted-foreground animate-pulse text-sm">Locking GPS satellites...</p>
            ) : location ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary font-mono text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lat:</span>
                    <span className="font-bold text-primary">{location.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lng:</span>
                    <span className="font-bold text-primary">{location.lng.toFixed(6)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyCoordinates} className="flex-1 text-xs">
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Coordinates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, "_blank")}
                    className="flex-1 text-xs"
                  >
                    View on Map
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Wilderness Survival Protocol Tips */}
        <Card className="border-border bg-card/60">
          <CardHeader className="py-3 px-4 border-b border-border">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent" /> Emergency Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>• <strong>S.T.O.P. Rule:</strong> Stop, Think, Observe, Plan before moving.</li>
              <li>• <strong>Stay Put:</strong> Do not wander after sending an SOS unless immediate threat is present.</li>
              <li>• <strong>Signal of Three:</strong> 3 whistle blasts or 3 fires is universally recognized as emergency distress.</li>
              <li>• <strong>Battery Saver:</strong> Enable Airplane Mode with GPS active to conserve power.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SOSPage;
