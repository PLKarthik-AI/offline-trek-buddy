import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gradient-adventure p-6 text-foreground">
      <div className="text-center space-y-4 max-w-md p-8 rounded-2xl bg-card border border-border shadow-card animate-fade-in-up">
        <div className="p-4 rounded-full bg-primary/10 text-primary inline-flex shadow-glow">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>
        <h1 className="text-5xl font-black text-primary">404</h1>
        <h2 className="text-xl font-bold">Off-Trail Route (Page Not Found)</h2>
        <p className="text-sm text-muted-foreground">
          The path <code className="font-mono text-accent font-semibold">{location.pathname}</code> does not exist on your map.
        </p>
        <div className="pt-2">
          <Button asChild variant="default" className="font-bold">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" /> Return to Base Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
