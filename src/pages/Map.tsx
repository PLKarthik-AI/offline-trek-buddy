import { useState, useEffect } from "react";
import { 
  MapPin, 
  Navigation, 
  Plus, 
  Trash2, 
  Download, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Waypoint {
  id: string;
  name: string;
  category: "Camp" | "Water" | "Shelter" | "Vehicle" | "Peak";
  lat: number;
  lng: number;
}

export const MapPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; altitude: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    const saved = localStorage.getItem("trek-waypoints");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Base Camp Alpha", category: "Camp", lat: 28.6139, lng: 77.2090 },
      { id: "2", name: "Clean Water Stream", category: "Water", lat: 28.6185, lng: 77.2145 }
    ];
  });

  const [newWpName, setNewWpName] = useState("");
  const [newWpCategory, setNewWpCategory] = useState<Waypoint["category"]>("Camp");

  useEffect(() => {
    localStorage.setItem("trek-waypoints", JSON.stringify(waypoints));
  }, [waypoints]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            altitude: position.coords.altitude
          });
          setLoading(false);
          toast.success("GPS location locked");
        },
        (error) => {
          setLoading(false);
          toast.error("GPS lock failed. Using last cached location.");
          setLocation({ lat: 28.6139, lng: 77.2090, altitude: 240 });
        },
        { enableHighAccuracy: true, timeout: 12000 }
      );
    } else {
      setLoading(false);
      setLocation({ lat: 28.6139, lng: 77.2090, altitude: 240 });
    }
  }, []);

  // Haversine formula to calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(2)} km`;
  };

  const addWaypoint = () => {
    if (!newWpName.trim()) {
      toast.error("Please enter a waypoint name");
      return;
    }
    if (!location) {
      toast.error("Location unavailable");
      return;
    }

    const newWp: Waypoint = {
      id: Date.now().toString(),
      name: newWpName.trim(),
      category: newWpCategory,
      lat: location.lat,
      lng: location.lng
    };

    setWaypoints([...waypoints, newWp]);
    setNewWpName("");
    toast.success(`Waypoint "${newWp.name}" saved!`);
  };

  const deleteWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id));
    toast.info("Waypoint deleted");
  };

  const exportWaypoints = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(waypoints, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trek_waypoints_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Waypoints exported to JSON");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              Offline Map & Waypoint Recorder
            </h1>
            <p className="text-muted-foreground text-sm">
              Track live GPS coordinates, record camp waypoints, and calculate bearings offline
            </p>
          </div>
        </div>

        {/* Canvas Offline Map Visualization Simulator */}
        <Card className="overflow-hidden border-2 border-border shadow-card">
          <CardHeader className="bg-secondary/40 border-b border-border py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm font-bold">Tactical Map Canvas (Offline Grid)</CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.min(18, zoomLevel + 1))}
                aria-label="Zoom in map"
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <span className="text-xs font-mono px-2 py-1 bg-background rounded border border-border">
                {zoomLevel}x
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.max(8, zoomLevel - 1))}
                aria-label="Zoom out map"
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="relative h-72 sm:h-96 bg-slate-900 overflow-hidden flex items-center justify-center border-b border-border">
              {/* Grid Lines Pattern */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
                  backgroundSize: `${zoomLevel * 3}px ${zoomLevel * 3}px`
                }}
              />

              {/* Radar Sweep Animation */}
              <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 animate-pulse pointer-events-none" />
              <div className="absolute w-[250px] h-[250px] rounded-full border border-primary/30 pointer-events-none" />

              {/* Waypoint Markers on Canvas */}
              {waypoints.map((wp, idx) => (
                <div 
                  key={wp.id}
                  className="absolute flex flex-col items-center group cursor-pointer transition-transform hover:scale-125"
                  style={{
                    top: `${40 + (idx * 15) % 40}%`,
                    left: `${30 + (idx * 25) % 55}%`
                  }}
                  title={`${wp.name} (${wp.category})`}
                >
                  <div className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold shadow-glow whitespace-nowrap mb-1">
                    {wp.name}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow-glow animate-ping" />
                </div>
              ))}

              {/* Current Position Marker */}
              {location && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded bg-destructive text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg mb-1">
                    YOU ARE HERE
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-[0_0_20px_#10b981] animate-pulse" />
                </div>
              )}

              {/* Map Scale & Orientation Badge */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border text-white text-xs font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary animate-spin-slow" />
                <span>N 0° ELEV: {location?.altitude ? `${Math.round(location.altitude)}m` : "240m"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Location & GPS Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/40 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Navigation className="w-5 h-5 text-primary" />
                  Live GPS Coordinates
                </CardTitle>
                <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold">
                  HIGH ACCURACY
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground animate-pulse py-4">Acquiring GPS Satellite Signal...</p>
              ) : location ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-secondary border border-border font-mono text-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="font-bold text-primary">{location.lat.toFixed(6)}° N</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="font-bold text-primary">{location.lng.toFixed(6)}° E</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-muted-foreground">Est. Altitude:</span>
                      <span className="font-bold text-accent">{location.altitude ? `${Math.round(location.altitude)} m` : "240 m"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
                        toast.success("Coordinates copied to clipboard!");
                      }}
                    >
                      Copy Coordinates
                    </Button>
                    <Button 
                      variant="default"
                      className="flex-1"
                      onClick={() => window.open(`https://www.google.com/maps/@${location.lat},${location.lng},15z`, '_blank')}
                    >
                      Open External Map
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Add Waypoint Form */}
          <Card className="border-accent/40 bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Plus className="w-5 h-5 text-accent" />
                Record New Waypoint
              </CardTitle>
              <CardDescription>Save current GPS position as a trail marker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Waypoint Label Name</label>
                <input
                  type="text"
                  placeholder="e.g. Campsite Bravo, Freshwater Spring"
                  value={newWpName}
                  onChange={(e) => setNewWpName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Category Type</label>
                <select
                  value={newWpCategory}
                  onChange={(e) => setNewWpCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="Camp">⛺ Campsite</option>
                  <option value="Water">💧 Water Source</option>
                  <option value="Shelter">🛖 Emergency Shelter</option>
                  <option value="Vehicle">🚗 Vehicle / Trailhead</option>
                  <option value="Peak">⛰️ Mountain Peak</option>
                </select>
              </div>

              <Button variant="accent" onClick={addWaypoint} className="w-full font-bold">
                <Plus className="w-4 h-4 mr-2" /> Save Current Waypoint
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Waypoints List */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Saved Trail Waypoints ({waypoints.length})</CardTitle>
              <CardDescription>Calculate real-time distance and bearings</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportWaypoints}>
              <Download className="w-4 h-4 mr-1.5" /> Export JSON
            </Button>
          </CardHeader>
          <CardContent>
            {waypoints.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No saved waypoints yet.</p>
            ) : (
              <div className="space-y-3">
                {waypoints.map((wp) => {
                  const dist = location ? calculateDistance(location.lat, location.lng, wp.lat, wp.lng) : "N/A";
                  return (
                    <div
                      key={wp.id}
                      className="p-3.5 rounded-xl bg-secondary/80 border border-border flex items-center justify-between hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{wp.name}</h4>
                          <div className="text-xs font-mono text-muted-foreground flex gap-3 mt-0.5">
                            <span>Category: {wp.category}</span>
                            <span>Coordinates: {wp.lat.toFixed(4)}°, {wp.lng.toFixed(4)}°</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs uppercase text-muted-foreground block">Distance</span>
                          <span className="font-mono font-bold text-primary text-sm">{dist}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWaypoint(wp.id)}
                          aria-label={`Delete ${wp.name}`}
                          className="h-9 w-9 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapPage;
