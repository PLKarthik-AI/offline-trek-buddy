import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

import Index from "./pages/Index";
import MapPage from "./pages/Map";
import CompassPage from "./pages/Compass";
import SurvivalGuidePage from "./pages/SurvivalGuide";
import SOSPage from "./pages/SOS";
import ChecklistPage from "./pages/Checklist";
import Flashlight from "./pages/Flashlight";
import EnvironmentalTracker from "./pages/EnvironmentalTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export const App = () => {
  const [theme, setTheme] = useState<"dark" | "light" | "high-contrast">(() => {
    const saved = localStorage.getItem("trek-theme");
    return (saved as any) || "dark";
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("trek-sound");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("trek-theme", theme);
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-high-contrast");
    if (theme === "light") root.classList.add("theme-light");
    if (theme === "high-contrast") root.classList.add("theme-high-contrast");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("trek-sound", JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar 
              theme={theme} 
              setTheme={setTheme} 
              soundEnabled={soundEnabled} 
              setSoundEnabled={setSoundEnabled} 
            />
            <main role="main">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/compass" element={<CompassPage />} />
                <Route path="/guide" element={<SurvivalGuidePage />} />
                <Route path="/sos" element={<SOSPage />} />
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/flashlight" element={<Flashlight />} />
                <Route path="/weather" element={<EnvironmentalTracker />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
