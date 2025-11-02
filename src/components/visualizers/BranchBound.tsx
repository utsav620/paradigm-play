import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface City {
  id: string;
  x: number;
  y: number;
}

interface Route {
  path: string[];
  cost: number;
  isPruned: boolean;
  isOptimal: boolean;
}

interface Step {
  routes: Route[];
  currentRoute: string[] | null;
  bestCost: number;
  description: string;
}

const BranchBound = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const cities: City[] = [
    { id: "A", x: 200, y: 150 },
    { id: "B", x: 350, y: 100 },
    { id: "C", x: 450, y: 200 },
    { id: "D", x: 300, y: 250 },
  ];

  const distances: { [key: string]: number } = {
    "A-B": 8,
    "A-C": 12,
    "A-D": 10,
    "B-C": 6,
    "B-D": 9,
    "C-D": 7,
  };

  const getDistance = (from: string, to: string): number => {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    return distances[key1] || distances[key2] || 0;
  };

  useEffect(() => {
    const generatedSteps: Step[] = [];
    const routes: Route[] = [];
    let bestCost = Infinity;

    generatedSteps.push({
      routes: [],
      currentRoute: null,
      bestCost: Infinity,
      description: "Starting TSP with 4 cities. Finding optimal tour...",
    });

    // Simulate exploring routes with branch and bound
    const exploreRoutes = [
      { path: ["A", "B"], cost: 8, shouldPrune: false },
      { path: ["A", "B", "C"], cost: 14, shouldPrune: false },
      { path: ["A", "B", "C", "D", "A"], cost: 31, shouldPrune: false },
      { path: ["A", "B", "D"], cost: 17, shouldPrune: false },
      { path: ["A", "B", "D", "C", "A"], cost: 36, shouldPrune: true }, // Pruned (> 31)
      { path: ["A", "C"], cost: 12, shouldPrune: false },
      { path: ["A", "C", "B"], cost: 18, shouldPrune: false },
      { path: ["A", "C", "B", "D", "A"], cost: 37, shouldPrune: true }, // Pruned (> 31)
      { path: ["A", "C", "D"], cost: 19, shouldPrune: false },
      { path: ["A", "C", "D", "B", "A"], cost: 35, shouldPrune: true }, // Pruned (> 31)
      { path: ["A", "D"], cost: 10, shouldPrune: false },
      { path: ["A", "D", "B"], cost: 19, shouldPrune: false },
      { path: ["A", "D", "B", "C", "A"], cost: 37, shouldPrune: true }, // Pruned (> 31)
      { path: ["A", "D", "C"], cost: 17, shouldPrune: false },
      { path: ["A", "D", "C", "B", "A"], cost: 31, shouldPrune: false }, // Same as best
    ];

    exploreRoutes.forEach((routeData) => {
      const isComplete = routeData.path.length === 5;
      const cost = routeData.cost;

      if (isComplete && !routeData.shouldPrune) {
        if (cost < bestCost) {
          bestCost = cost;
          routes.forEach((r) => (r.isOptimal = false));
        }
      }

      const isPruned = routeData.shouldPrune || (isComplete && cost > bestCost);
      const route: Route = {
        path: routeData.path,
        cost,
        isPruned,
        isOptimal: isComplete && cost === bestCost,
      };
      routes.push(route);

      generatedSteps.push({
        routes: [...routes],
        currentRoute: routeData.path,
        bestCost: isComplete && !isPruned ? Math.min(bestCost, cost) : bestCost,
        description: isPruned
          ? `✂️ Pruned ${routeData.path.join("→")} (cost: ${cost} > bound: ${bestCost})`
          : isComplete
          ? `✓ Complete tour: ${routeData.path.join("→")} (cost: ${cost})`
          : `Exploring: ${routeData.path.join("→")} (cost so far: ${cost})`,
      });
    });

    generatedSteps.push({
      routes: [...routes],
      currentRoute: null,
      bestCost,
      description: `Optimal tour found with cost: ${bestCost}`,
    });

    setSteps(generatedSteps);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000 / speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-paradigm-branch-light border-paradigm-branch">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-paradigm-branch-dark mb-2">
              Traveling Salesman - Branch & Bound
            </h2>
            <p className="text-sm text-muted-foreground">
              Watch how the algorithm prunes branches that exceed the current best solution.
            </p>
          </div>

          {/* Graph Visualization */}
          <div className="bg-card rounded-lg border border-paradigm-branch p-4">
            <svg className="w-full h-80">
              {/* Draw all edges with distances */}
              {cities.map((city1, i) =>
                cities.slice(i + 1).map((city2) => {
                  const dist = getDistance(city1.id, city2.id);
                  const midX = (city1.x + city2.x) / 2;
                  const midY = (city1.y + city2.y) / 2;
                  
                  // Calculate offset for label positioning to avoid overlap
                  const dx = city2.x - city1.x;
                  const dy = city2.y - city1.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const offsetX = (-dy / length) * 15;
                  const offsetY = (dx / length) * 15;

                  const isInCurrentRoute =
                    currentStepData?.currentRoute &&
                    currentStepData.currentRoute.includes(city1.id) &&
                    currentStepData.currentRoute.includes(city2.id);

                  return (
                    <g key={`${city1.id}-${city2.id}`}>
                      <line
                        x1={city1.x}
                        y1={city1.y}
                        x2={city2.x}
                        y2={city2.y}
                        stroke={
                          isInCurrentRoute
                            ? "hsl(var(--branch-bound))"
                            : "hsl(var(--branch-bound) / 0.2)"
                        }
                        strokeWidth={isInCurrentRoute ? "3" : "1"}
                      />
                      <rect
                        x={midX + offsetX - 10}
                        y={midY + offsetY - 8}
                        width="20"
                        height="16"
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        rx="3"
                      />
                      <text
                        x={midX + offsetX}
                        y={midY + offsetY + 4}
                        textAnchor="middle"
                        fill="hsl(var(--branch-bound-dark))"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {dist}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Draw cities */}
              {cities.map((city) => {
                const isInCurrentRoute =
                  currentStepData?.currentRoute?.includes(city.id) || false;

                return (
                  <g key={city.id}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="25"
                      fill={
                        isInCurrentRoute
                          ? "hsl(var(--branch-bound))"
                          : "hsl(var(--card))"
                      }
                      stroke="hsl(var(--branch-bound))"
                      strokeWidth="2"
                    />
                    <text
                      x={city.x}
                      y={city.y + 5}
                      textAnchor="middle"
                      fill={isInCurrentRoute ? "white" : "hsl(var(--foreground))"}
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {city.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Routes Explored */}
          <div className="bg-card rounded-lg border border-paradigm-branch p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-paradigm-branch-dark">
                Routes Explored ({currentStepData?.routes.length || 0})
              </h3>
              <div className="text-xs text-paradigm-branch-dark font-mono">
                Best Cost: {currentStepData?.bestCost === Infinity ? "∞" : currentStepData?.bestCost}
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {currentStepData?.routes.map((route, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`px-3 py-1 rounded-md text-xs font-mono flex justify-between ${
                    route.isOptimal
                      ? "bg-paradigm-branch text-white font-bold"
                      : route.isPruned
                      ? "bg-muted text-muted-foreground line-through"
                      : "bg-paradigm-branch-light border border-paradigm-branch text-paradigm-branch-dark"
                  }`}
                >
                  <span>{route.path.join("→")}</span>
                  <span>{route.cost}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step Description */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card rounded-lg border border-paradigm-branch"
          >
            <p className="text-center text-paradigm-branch-dark font-medium">
              {currentStepData?.description}
            </p>
          </motion.div>
        </div>
      </Card>

      <ControlPanel
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onReset={handleReset}
        currentStep={currentStep}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};

export default BranchBound;
