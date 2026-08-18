import { useState } from "react";
import { 
  BookOpen, 
  Droplet, 
  Flame, 
  Heart, 
  Home, 
  Radio, 
  Search, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SurvivalStep {
  id: string;
  text: string;
  completed: boolean;
}

interface Guide {
  id: string;
  title: string;
  icon: any;
  category: string;
  description: string;
  content: SurvivalStep[];
}

const defaultGuides: Guide[] = [
  {
    id: "water",
    title: "Finding & Purifying Water",
    icon: Droplet,
    category: "Water",
    description: "Crucial hydration techniques and purification rules",
    content: [
      { id: "w1", text: "Look for water in low valleys, base of cliffs, and green vegetation zones", completed: false },
      { id: "w2", text: "Follow animal tracks at dawn/dusk - they frequently lead to natural streams", completed: false },
      { id: "w3", text: "Morning Dew: Tie clean absorbent cloth around ankles and walk through wet grass", completed: false },
      { id: "w4", text: "Boil water vigorously for at least 3 full minutes (5 mins at high altitude)", completed: false },
      { id: "w5", text: "Filter turbid water through cloth, sand, and charcoal prior to boiling", completed: false },
      { id: "w6", text: "Never consume untreated stagnant water, snow directly, or sea water", completed: false }
    ]
  },
  {
    id: "fire",
    title: "Starting & Maintaining Fire",
    icon: Flame,
    category: "Fire",
    description: "Tinder prep, shelter fire safety, and ember building",
    content: [
      { id: "f1", text: "Gather 3 fuel sizes: Tinder (grass/lint), Kindling (twigs), Fuel (logs)", completed: false },
      { id: "f2", text: "Construct a wind-protected Teepee or Log Cabin wood structure", completed: false },
      { id: "f3", text: "Use fire steel or magnifiers angled at dry cotton/bark tinder", completed: false },
      { id: "f4", text: "Blow gently on glowing ember to nurture oxygen flow", completed: false },
      { id: "f5", text: "Extinguish completely before sleep: Drown with water, stir ash, check for heat", completed: false }
    ]
  },
  {
    id: "shelter",
    title: "Emergency Shelter Construction",
    icon: Home,
    category: "Shelter",
    description: "Insulation against wind, snow, rain, and hypothermia",
    content: [
      { id: "s1", text: "Avoid hazard locations: dead branches above (widowmakers) and dried riverbeds", completed: false },
      { id: "s2", text: "Construct Lean-to or A-Frame using sturdy ridge pole against tree fork", completed: false },
      { id: "s3", text: "Insulate floor bed with 6-8 inches of dry leaves, pine needles, or grass", completed: false },
      { id: "s4", text: "Cover roof with thick shingle-like layers of leafy boughs shed rain downward", completed: false },
      { id: "s5", text: "Keep shelter entrance perpendicular to prevailing mountain wind direction", completed: false }
    ]
  },
  {
    id: "firstaid",
    title: "Wilderness First Aid & Trauma",
    icon: Heart,
    category: "Medical",
    description: "Hemorrhage control, hypothermia treatment, and shock",
    content: [
      { id: "m1", text: "Severe Bleeding: Apply firm, continuous direct pressure with sterile cloth", completed: false },
      { id: "m2", text: "Treat Shock: Elevate feet 12 inches, keep warm with emergency blanket", completed: false },
      { id: "m3", text: "Hypothermia: Strip wet clothes immediately, wrap in dry sleeping bag", completed: false },
      { id: "m4", text: "Snake/Insect Bite: Keep limb below heart level, immobilize, DO NOT cut or suck wound", completed: false },
      { id: "m5", text: "Sanitize open wounds with clean water, avoid sealing infected punctures", completed: false }
    ]
  },
  {
    id: "signaling",
    title: "Rescuer Emergency Signaling",
    icon: Radio,
    category: "Signaling",
    description: "International distress calls, mirrors, and smoke fires",
    content: [
      { id: "g1", text: "Rule of Three: 3 whistle blasts, 3 smoke fires, or 3 flash pulses indicate SOS", completed: false },
      { id: "g2", text: "Signal Fire: Add green branches or rubber to blaze for thick white/black smoke", completed: false },
      { id: "g3", text: "Signal Mirror: Aim reflected sunbeam across horizon at search aircraft", completed: false },
      { id: "g4", text: "Construct large 10-meter 'SOS' signal in open clearing using rocks or logs", completed: false }
    ]
  }
];

export const SurvivalGuidePage = () => {
  const [guides, setGuides] = useState<Guide[]>(defaultGuides);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  const categories = ["All", "Water", "Fire", "Shelter", "Medical", "Signaling"];

  const filteredGuides = guides.filter((guide) => {
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    const matchesSearch = 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.content.some((step) => step.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleStep = (guideId: string, stepId: string) => {
    setGuides(guides.map((g) => {
      if (g.id !== guideId) return g;
      return {
        ...g,
        content: g.content.map((step) => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      };
    }));

    if (activeGuide && activeGuide.id === guideId) {
      setActiveGuide({
        ...activeGuide,
        content: activeGuide.content.map((step) => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      });
    }
  };

  if (activeGuide) {
    const completedCount = activeGuide.content.filter((s) => s.completed).length;
    const progressPercent = Math.round((completedCount / activeGuide.content.length) * 100);

    return (
      <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setActiveGuide(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides
            </Button>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
              {completedCount} / {activeGuide.content.length} STEPS DONE
            </span>
          </div>

          <Card className="border-2 border-primary/30 shadow-card">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 text-primary shadow-glow">
                  <activeGuide.icon className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{activeGuide.title}</CardTitle>
                  <CardDescription>{activeGuide.description}</CardDescription>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                {activeGuide.content.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(activeGuide.id, step.id)}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      step.completed 
                        ? "bg-primary/10 border-primary/40 text-muted-foreground" 
                        : "bg-secondary/60 border-border hover:border-primary text-foreground"
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      step.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                    }`}>
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <span className={`text-sm font-medium ${step.completed ? "line-through" : ""}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Offline Survival Guide
          </h1>
          <p className="text-muted-foreground text-sm">
            Field manuals for finding water, building shelter, medical first aid & distress signaling
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search survival guide topics (e.g., boil, bleeding, shelter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-card"
              aria-label="Search survival guides"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map((guide) => {
            const completedCount = guide.content.filter((s) => s.completed).length;
            return (
              <Card
                key={guide.id}
                onClick={() => setActiveGuide(guide)}
                className="cursor-pointer border-border hover:border-primary transition-all duration-300 hover:scale-[1.02] shadow-card bg-card group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-primary group-hover:scale-110 transition-transform">
                        <guide.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                          {guide.title}
                        </CardTitle>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                          {guide.category}
                        </span>
                      </div>
                    </div>
                    {completedCount > 0 && (
                      <span className="text-xs font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded-full border border-primary/30">
                        {completedCount}/{guide.content.length}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {guide.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurvivalGuidePage;
