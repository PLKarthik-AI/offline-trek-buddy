import { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Thermometer, 
  Clock, 
  ShieldAlert 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const EnvironmentalTracker = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [tempC, setTempC] = useState<number>(18);
  const [windSpeed, setWindSpeed] = useState<number>(15);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Default fallback (e.g. 28.6139, 77.2090)
          setCoords({ lat: 28.6139, lng: 77.2090 });
        }
      );
    } else {
      setCoords({ lat: 28.6139, lng: 77.2090 });
    }
  }, []);

  // Simplified Sun Calculations
  const now = new Date();
  const sunriseHour = 6;
  const sunsetHour = 18.5; // 6:30 PM
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  
  let daylightLeftHours = Math.max(0, sunsetHour - currentHourDecimal);
  const daylightLeftFormatted = daylightLeftHours > 0 
    ? `${Math.floor(daylightLeftHours)}h ${Math.round((daylightLeftHours % 1) * 60)}m`
    : "Sun has set (Nighttime)";

  // Moon Phase Calculation
  const getMoonPhase = (date: Date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 3) {
      year--;
      month += 12;
    }
    month++;
    let c = 365.25 * year;
    let e = 30.6 * month;
    let jd = c + e + day - 694039.09; // Julian Date relative
    jd /= 29.5305882; // Lunar cycles
    let b = Math.floor(jd);
    jd -= b; // fractional part
    let phase = Math.round(jd * 8);
    if (phase >= 8) phase = 0;

    const phases = [
      { name: "New Moon 🌑", illumination: "0%", visibility: "Poor (Very Dark)" },
      { name: "Waxing Crescent 🌒", illumination: "25%", visibility: "Low Light" },
      { name: "First Quarter 🌓", illumination: "50%", visibility: "Moderate Light" },
      { name: "Waxing Gibbous 🌔", illumination: "75%", visibility: "Good Light" },
      { name: "Full Moon 🌕", illumination: "100%", visibility: "Excellent Night Visibility" },
      { name: "Waning Gibbous 🌖", illumination: "75%", visibility: "Good Light" },
      { name: "Last Quarter 🌗", illumination: "50%", visibility: "Moderate Light" },
      { name: "Waning Crescent 🌘", illumination: "25%", visibility: "Low Light" },
    ];

    return phases[phase];
  };

  const moonPhase = getMoonPhase(now);

  // Wind Chill Index Formula (North American standard: 13.12 + 0.6215*T - 11.37*V^0.16 + 0.3965*T*V^0.16)
  const calculateWindChill = (t: number, v: number) => {
    if (t > 10 || v < 4.8) return t; // Wind chill only defined for T <= 10°C and V > 4.8 km/h
    const wc = 13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16);
    return Math.round(wc);
  };

  const windChillTemp = calculateWindChill(tempC, windSpeed);
  const tempF = Math.round((tempC * 9) / 5 + 32);

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Sun className="w-8 h-8 text-amber-500" />
            Environmental Tracker
          </h1>
          <p className="text-muted-foreground text-sm">
            Solar hours, moon light visibility, and thermal safety index for offline trekking
          </p>
        </div>

        {/* Sun & Daylight Card */}
        <Card className="border-amber-500/30 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />
                <CardTitle className="text-xl">Sun & Daylight Schedule</CardTitle>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {coords ? `GPS: ${coords.lat.toFixed(2)}°, ${coords.lng.toFixed(2)}°` : "Calculating..."}
              </span>
            </div>
            <CardDescription>
              Monitor remaining daylight to set up camp before dark
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-secondary/80 border border-border text-center space-y-1">
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Sunrise
                </div>
                <div className="text-2xl font-bold text-foreground">06:00 AM</div>
                <div className="text-[11px] text-muted-foreground">Morning Dusk Ends</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-amber-400 flex items-center justify-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Daylight Left
                </div>
                <div className="text-2xl font-black text-amber-400">{daylightLeftFormatted}</div>
                <div className="text-[11px] text-amber-300 font-medium">Until Sunset</div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/80 border border-border text-center space-y-1">
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-blue-400" /> Sunset
                </div>
                <div className="text-2xl font-bold text-foreground">06:30 PM</div>
                <div className="text-[11px] text-muted-foreground">Evening Twilight Starts</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Safety Rule: Always reserve 1.5 to 2 hours of daylight for pitching tent and preparing drinking water.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Moon Phase & Night Visibility */}
        <Card className="border-blue-500/30 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-xl">Lunar Phase & Night Illumination</CardTitle>
            </div>
            <CardDescription>
              Predict natural moonlight visibility for nocturnal hiking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-secondary/70 border border-border gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">{moonPhase.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  Est. Illumination: <span className="font-semibold text-primary">{moonPhase.illumination}</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-bold text-center">
                Night Visibility: {moonPhase.visibility}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature & Wind Chill Safety Estimator */}
        <Card className="border-destructive/30 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-destructive" />
              <CardTitle className="text-xl">Thermal Safety & Wind Chill Estimator</CardTitle>
            </div>
            <CardDescription>
              Adjust temperature and wind speed to check hypothermia danger levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Temperature Control */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between text-foreground">
                  <span>Air Temperature (°C):</span>
                  <span className="font-mono text-primary">{tempC}°C ({tempF}°F)</span>
                </label>
                <input
                  type="range"
                  min="-20"
                  max="45"
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
                  aria-label="Adjust temperature in Celsius"
                />
              </div>

              {/* Wind Speed Control */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between text-foreground">
                  <span>Wind Speed (km/h):</span>
                  <span className="font-mono text-accent">{windSpeed} km/h</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-2 bg-secondary rounded-lg"
                  aria-label="Adjust wind speed in kilometers per hour"
                />
              </div>
            </div>

            {/* Calculated Feels Like Output */}
            <div className="p-4 rounded-xl bg-secondary border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-semibold text-muted-foreground block">Apparent Wind Chill Temperature</span>
                <span className="text-3xl font-black text-foreground">{windChillTemp}°C ({Math.round((windChillTemp * 9) / 5 + 32)}°F)</span>
              </div>
              
              <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${
                windChillTemp < 0 
                  ? "bg-destructive/20 text-destructive border-destructive/40 animate-pulse" 
                  : windChillTemp > 35 
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40" 
                    : "bg-primary/20 text-primary border-primary/40"
              }`}>
                {windChillTemp < -10 
                  ? "⚠️ Extreme Hypothermia Risk" 
                  : windChillTemp < 5 
                    ? "❄️ Cold Hazard - Warm Layers Needed" 
                    : windChillTemp > 35 
                      ? "🔥 Heat Stroke Warning - Stay Hydrated" 
                      : "✅ Safe Trail Conditions"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnvironmentalTracker;
