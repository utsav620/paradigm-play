import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const Backtracking = () => {
  return (
    <Card className="p-12 bg-paradigm-backtrack-light border-paradigm-backtrack">
      <div className="flex flex-col items-center justify-center gap-6 min-h-[400px]">
        <Construction className="h-20 w-20 text-paradigm-backtrack animate-pulse-glow" />
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-paradigm-backtrack-dark">
            Backtracking Visualizer
          </h2>
          <p className="text-muted-foreground max-w-md">
            Coming soon! This will show permutation generation with branching and backtracking visualization.
          </p>
          <div className="pt-4 text-sm text-paradigm-backtrack-dark">
            <p className="font-medium">Planned Features:</p>
            <ul className="mt-2 space-y-1">
              <li>• Tree-based exploration visualization</li>
              <li>• Step-by-step permutation generation</li>
              <li>• Backtrack path highlighting</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Backtracking;
