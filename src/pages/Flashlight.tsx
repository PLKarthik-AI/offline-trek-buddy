import { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Eye, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Sun, 
  Play, 
  Square 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type FlashlightMode = "white" | "red" | "strobe";

export const Flashlight = () => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setMode] = useState<FlashlightMode>("white");
  const [audioSignal, setAudioSignal] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator for SOS pattern (... --- ...)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (audioSignal) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      let dotDashSequence = [
        100, 100, 100, 100, 100, 300, // ...
        300, 100, 300, 100, 300, 300, // ---
        100, 100, 100, 100, 100, 600  // ...
      ];

      let step = 0;
      const playNextSignal = () => {
        if (!audioSignal || !ctx) return;
        const duration = dotDashSequence[step % dotDashSequence.length];
        const isBeep = step % 2 === 0;

        if (isBeep) {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = 880; // High frequency emergency tone
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration / 1000);
          } catch (e) {
            console.error(e);
          }
        }

        step++;
        timer = setTimeout(playNextSignal, duration);
      };

      playNextSignal();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [audioSignal]);

  const toggleFlashlight = () => {
    setIsOn(!isOn);
    if (!isOn) {
      toast.success("Torch activated");
    } else {
      toast.info("Torch turned off");
      setAudioSignal(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Zap className="w-7 h-7 text-accent" />
              Flashlight & Signal
            </h1>
            <p className="text-muted-foreground text-sm">
              Screen torch, night-vision red light & emergency audio signal generator
            </p>
          </div>
        </div>

        {/* Fullscreen Torch Light Display Container */}
        <Card className="overflow-hidden border-2 border-border shadow-card transition-all">
          <CardContent className="p-0">
            <div 
              className={`relative h-64 sm:h-80 flex flex-col items-center justify-center p-6 transition-all duration-300 ${
                !isOn 
                  ? "bg-slate-950 text-slate-400" 
                  : mode === "white" 
                    ? "bg-white text-slate-900 shadow-[0_0_80px_rgba(255,255,255,0.8)]" 
                    : mode === "red" 
                      ? "bg-red-600 text-white shadow-[0_0_80px_rgba(239,68,68,0.8)]" 
                      : "animate-strobe-flash text-black font-bold"
              }`}
            >
              <button
                onClick={toggleFlashlight}
                className={`group flex flex-col items-center gap-4 focus-visible:ring-4 focus-visible:ring-primary rounded-full p-8 transition-transform active:scale-95 ${
                  isOn ? "scale-105" : "hover:scale-105"
                }`}
                aria-label={isOn ? "Turn off torch" : "Turn on torch"}
              >
                <div 
                  className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all ${
                    isOn 
                      ? mode === "white" 
                        ? "bg-slate-900 text-white border-slate-700 shadow-glow" 
                        : "bg-black text-white border-red-300"
                      : "bg-primary/20 text-primary border-primary/50 shadow-glow"
                  }`}
                >
                  <Sun className={`w-12 h-12 transition-transform ${isOn ? "rotate-90 scale-110" : ""}`} />
                </div>
                <span className="text-xl font-extrabold uppercase tracking-widest">
                  {isOn ? "TORCH ON - CLICK TO OFF" : "TAP TO TURN ON"}
                </span>
              </button>

              <div className="absolute bottom-4 text-xs font-semibold px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/20">
                Mode: {mode.toUpperCase()} {isOn ? "(ACTIVE)" : "(OFF)"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={mode === "white" ? "default" : "outline"}
            onClick={() => {
              setMode("white");
              toast.info("White torch mode selected");
            }}
            className="flex flex-col sm:flex-row items-center gap-2 h-auto py-3 text-sm font-semibold"
            aria-label="Set white light mode"
          >
            <Sun className="w-5 h-5 text-amber-400" />
            <span>White Light</span>
          </Button>

          <Button
            variant={mode === "red" ? "destructive" : "outline"}
            onClick={() => {
              setMode("red");
              toast.info("Red night-vision mode selected");
            }}
            className="flex flex-col sm:flex-row items-center gap-2 h-auto py-3 text-sm font-semibold"
            aria-label="Set red night-vision mode"
          >
            <Eye className="w-5 h-5 text-red-400" />
            <span>Night Red</span>
          </Button>

          <Button
            variant={mode === "strobe" ? "sos" : "outline"}
            onClick={() => {
              setMode("strobe");
              setIsOn(true);
              toast.warning("Emergency strobe light active!");
            }}
            className="flex flex-col sm:flex-row items-center gap-2 h-auto py-3 text-sm font-semibold"
            aria-label="Set emergency strobe mode"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>SOS Strobe</span>
          </Button>
        </div>

        {/* Audio SOS Sound Signal */}
        <Card className="border-accent/40 bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              {audioSignal ? <Volume2 className="w-5 h-5 text-accent animate-pulse" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
              Audio SOS Distress Signal
            </CardTitle>
            <CardDescription>
              Emits continuous acoustic Morse Code SOS sound pattern (`... --- ...`) to attract rescue teams or search parties.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant={audioSignal ? "destructive" : "accent"}
              onClick={() => {
                const nextState = !audioSignal;
                setAudioSignal(nextState);
                if (nextState) toast.success("SOS Audio Beacon sounding...");
                else toast.info("SOS Audio Beacon stopped");
              }}
              className="w-full h-12 text-base font-bold flex items-center justify-center gap-2"
            >
              {audioSignal ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  Stop Audio SOS Beacon
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Start Audio SOS Beacon (... --- ...)
                </>
              )}
            </Button>

            <div className="p-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">💡 Wilderness Survival Tip:</p>
              <p>• Use Red Night Vision to read maps without destroying your dark-adapted vision.</p>
              <p>• SOS Strobe Light is visible up to 5 miles away at night.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Flashlight;
