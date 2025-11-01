import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const BranchBound = () => {
  return (
    <Card className="p-12 bg-paradigm-branch-light border-paradigm-branch">
      <div className="flex flex-col items-center justify-center gap-6 min-h-[400px]">
        <Construction className="h-20 w-20 text-paradigm-branch animate-pulse-glow" />
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-paradigm-branch-dark">
            Branch & Bound Visualizer
          </h2>
          <p className="text-muted-foreground max-w-md">
            Coming soon! This will demonstrate the Traveling Salesman Problem with branch pruning.
          </p>
          <div className="pt-4 text-sm text-paradigm-branch-dark">
            <p className="font-medium">Planned Features:</p>
            <ul className="mt-2 space-y-1">
              <li>• TSP route exploration</li>
              <li>• Bound calculation visualization</li>
              <li>• Pruned branch highlighting</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BranchBound;
