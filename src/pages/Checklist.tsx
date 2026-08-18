import { useState, useEffect } from "react";
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  name: string;
  category: "Essentials" | "Medical" | "Shelter" | "Tools" | "Food/Water" | "Tech";
  checked: boolean;
}

const defaultItems: ChecklistItem[] = [
  { id: "1", name: "Water bottles & purification tablets (min 3L)", category: "Food/Water", checked: true },
  { id: "2", name: "Wilderness First Aid trauma kit", category: "Medical", checked: true },
  { id: "3", name: "High-lumen Flashlight & extra batteries", category: "Tech", checked: false },
  { id: "4", name: "Fixed blade multi-tool knife", category: "Tools", checked: true },
  { id: "5", name: "Topographic paper map & digital compass", category: "Essentials", checked: true },
  { id: "6", name: "Thermal emergency bivvy blanket", category: "Shelter", checked: false },
  { id: "7", name: "Fire starter matches & ferro rod", category: "Tools", checked: false },
  { id: "8", name: "High-decibel emergency whistle", category: "Essentials", checked: false },
  { id: "9", name: "High-calorie energy bars & trail mix", category: "Food/Water", checked: false },
  { id: "10", name: "50ft 550 Paracord rope", category: "Tools", checked: false },
  { id: "11", name: "Fully charged power bank & cables", category: "Tech", checked: false },
  { id: "12", name: "Waterproof rain jacket & thermal layer", category: "Essentials", checked: false },
];

export const ChecklistPage = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem("trek-checklist-v2");
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem["category"]>("Essentials");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    localStorage.setItem("trek-checklist-v2", JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addItem = () => {
    if (!newItemName.trim()) {
      toast.error("Please enter an item description");
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      checked: false,
    };

    setItems([...items, newItem]);
    setNewItemName("");
    toast.success(`Added "${newItem.name}" to checklist!`);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.info("Item deleted");
  };

  const resetChecklist = () => {
    setItems(defaultItems);
    toast.info("Checklist reset to defaults");
  };

  const categories = ["All", "Essentials", "Medical", "Shelter", "Tools", "Food/Water", "Tech"];

  const filteredItems = items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  const checkedCount = items.filter((item) => item.checked).length;
  const progressPercent = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-adventure p-4 sm:p-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-8 h-8 text-primary" />
              Trip Gear & Safety Checklist
            </h1>
            <p className="text-muted-foreground text-sm">
              Verify essential equipment, medical supplies & survival gear before stepping on trail
            </p>
          </div>
        </div>

        {/* Progress Dashboard */}
        <Card className="border-2 border-primary/30 shadow-card bg-card p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Packing Preparedness</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">{checkedCount}</span> of {items.length} gear items packed
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetChecklist} className="text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 shadow-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 text-right">
            <span className="text-xs font-mono font-bold text-primary">{progressPercent}% COMPLETE</span>
          </div>
        </Card>

        {/* Add New Gear Item */}
        <Card className="border-border bg-card">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" /> Add Custom Gear Item
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. Extra wool socks, Insect repellent, GPS satellite tracker..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus-visible:ring-2 focus-visible:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />

              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="Essentials">Essentials</option>
                <option value="Medical">Medical</option>
                <option value="Shelter">Shelter</option>
                <option value="Tools">Tools</option>
                <option value="Food/Water">Food/Water</option>
                <option value="Tech">Tech</option>
              </select>

              <Button variant="accent" onClick={addItem} className="font-bold">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-glow"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items List */}
        <Card className="border-border bg-card">
          <CardContent className="p-4 space-y-2">
            {filteredItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">No items found in this category.</p>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    item.checked 
                      ? "bg-primary/5 border-primary/30 text-muted-foreground" 
                      : "bg-secondary/60 border-border hover:border-primary text-foreground"
                  }`}
                >
                  <div
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm font-medium cursor-pointer ${
                        item.checked ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      {item.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* 100% Prepared Banner */}
        {progressPercent === 100 && (
          <Card className="border-2 border-primary bg-primary/10 p-6 text-center space-y-2 animate-bounce">
            <Sparkles className="w-10 h-10 text-primary mx-auto" />
            <h3 className="text-2xl font-bold text-foreground">100% READY FOR THE WILDERNESS!</h3>
            <p className="text-sm text-muted-foreground">
              All essential gear is packed. Remember to notify someone of your itinerary before departure!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChecklistPage;
