import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  badge?: string;
  className?: string;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  badge, 
  className 
}: FeatureCardProps) => {
  return (
    <Card 
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-primary hover:shadow-glow p-6 bg-card border-border relative overflow-hidden focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      onClick={onClick}
    >
      {/* Background Accent Glow on Hover */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary/10 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      {badge && (
        <span className="absolute top-3 right-3 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40">
          {badge}
        </span>
      )}

      <div className="flex flex-col items-center text-center gap-3.5 relative z-10">
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-glow text-primary">
          <Icon className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};
