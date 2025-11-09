import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface Node {
  id: string;
  x: number;
  y: number;
  distance: number;
  visited: boolean;
}

interface Step {
  nodes: Node[];
  currentNode: string | null;
  description: string;
  distanceMatrix: { [key: string]: number };
  currentLine: number | null;
}

const Greedy = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const nodes: Node[] = [
      { id: "A", x: 100, y: 150, distance: 0, visited: false },
      { id: "B", x: 250, y: 80, distance: Infinity, visited: false },
      { id: "C", x: 250, y: 220, distance: Infinity, visited: false },
      { id: "D", x: 400, y: 80, distance: Infinity, visited: false },
      { id: "E", x: 400, y: 220, distance: Infinity, visited: false },
      { id: "F", x: 550, y: 150, distance: Infinity, visited: false },
    ];

    const generatedSteps: Step[] = [];
    const distanceMatrix: { [key: string]: number } = {};
    nodes.forEach(n => distanceMatrix[n.id] = n.distance);

    generatedSteps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      currentNode: null,
      description: "Starting at node A with distance 0",
      distanceMatrix: { ...distanceMatrix },
      currentLine: null,
    });

    let currentNodes = JSON.parse(JSON.stringify(nodes));

    const updates = [
      { node: "A", distance: 0, desc: "Start at A (distance: 0)" },
      { node: "B", distance: 4, desc: "Update B: distance 0 + 4 = 4" },
      { node: "C", distance: 2, desc: "Update C: distance 0 + 2 = 2" },
      { node: "C", distance: 2, desc: "Select C (smallest distance: 2)", visit: true },
      { node: "B", distance: 3, desc: "Update B via C: 2 + 1 = 3 (better!)" },
      { node: "E", distance: 7, desc: "Update E via C: 2 + 5 = 7" },
      { node: "B", distance: 3, desc: "Select B (smallest unvisited: 3)", visit: true },
      { node: "D", distance: 5, desc: "Update D via B: 3 + 2 = 5" },
      { node: "D", distance: 5, desc: "Select D (smallest unvisited: 5)", visit: true },
      { node: "F", distance: 7, desc: "Update F via D: 5 + 2 = 7" },
      { node: "E", distance: 6, desc: "Update E via D: 5 + 1 = 6 (better!)" },
      { node: "E", distance: 6, desc: "Select E (smallest unvisited: 6)", visit: true },
      { node: "F", distance: 7, desc: "Select F (final node)", visit: true },
    ];

    updates.forEach((update) => {
      const nodeIndex = currentNodes.findIndex((n: Node) => n.id === update.node);
      if (nodeIndex !== -1) {
        if (update.distance !== undefined) {
          currentNodes[nodeIndex].distance = update.distance;
          distanceMatrix[update.node] = update.distance;
        }
        if (update.visit) {
          currentNodes[nodeIndex].visited = true;
        }
      }

      let lineNum = null;
      if (update.desc.includes("Start")) lineNum = 1;
      else if (update.desc.includes("Select")) lineNum = 2;
      else if (update.desc.includes("Update")) lineNum = 3;

      generatedSteps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        currentNode: update.node,
        description: update.desc,
        distanceMatrix: { ...distanceMatrix },
        currentLine: lineNum,
      });
    });

    generatedSteps.push({
      nodes: currentNodes,
      currentNode: null,
      description: "Shortest paths found! All nodes visited.",
      distanceMatrix: { ...distanceMatrix },
      currentLine: null,
    });

    setSteps(generatedSteps);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), 1000 / speed);
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

  const pseudoCode = [
    "dist[start] = 0, all others = ∞",
    "while unvisited nodes exist:",
    "  select node with min distance",
    "  for each neighbor:",
    "    newDist = dist[node] + edge_weight",
    "    if newDist < dist[neighbor]:",
    "      dist[neighbor] = newDist",
  ];

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-paradigm-greedy-light border-paradigm-greedy">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Graph */}
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-paradigm-greedy-dark mb-2">
                Dijkstra's Algorithm - Greedy Approach
              </h2>
              <p className="text-sm text-muted-foreground">
                Watch how the algorithm greedily selects the node with the smallest distance at each step.
              </p>
            </div>

            {/* Graph Visualization */}
            <div className="relative h-80 bg-card rounded-lg border border-paradigm-greedy p-4">
              <svg className="absolute inset-0 w-full h-full">
                {/* Edges with weights */}
                <line x1="100" y1="150" x2="250" y2="80" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="175" y="110" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">4</text>
                <line x1="100" y1="150" x2="250" y2="220" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="175" y="195" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">2</text>
                <line x1="250" y1="80" x2="400" y2="80" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="325" y="70" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">2</text>
                <line x1="250" y1="220" x2="400" y2="220" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="325" y="240" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">5</text>
                <line x1="250" y1="80" x2="250" y2="220" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="260" y="150" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">1</text>
                <line x1="400" y1="80" x2="550" y2="150" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="475" y="110" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">2</text>
                <line x1="400" y1="220" x2="550" y2="150" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="475" y="195" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">1</text>
                <line x1="400" y1="80" x2="400" y2="220" stroke="hsl(var(--greedy) / 0.3)" strokeWidth="2" />
                <text x="410" y="150" fill="hsl(var(--greedy-dark))" fontSize="12" fontWeight="bold">1</text>
              </svg>

              <AnimatePresence>
                {currentStepData?.nodes.map((node) => {
                  const isCurrent = node.id === currentStepData.currentNode;
                  const isVisited = node.visited;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute"
                      style={{ left: node.x - 30, top: node.y - 30 }}
                    >
                      <motion.div
                        animate={{
                          backgroundColor: isCurrent
                            ? "hsl(var(--greedy))"
                            : isVisited
                            ? "hsl(var(--greedy-dark))"
                            : "hsl(var(--card))",
                          scale: isCurrent ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-16 h-16 rounded-full border-2 border-paradigm-greedy flex flex-col items-center justify-center shadow-lg"
                      >
                        <span className="text-sm font-bold">{node.id}</span>
                        <span className="text-xs">
                          {node.distance === Infinity ? "∞" : node.distance}
                        </span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Step Description */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-card rounded-lg border border-paradigm-greedy"
            >
              <p className="text-center text-paradigm-greedy-dark font-medium">
                {currentStepData?.description}
              </p>
            </motion.div>
          </div>

          {/* Right Column - Pseudo Code & Distance Matrix */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-paradigm-greedy p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-paradigm-greedy-dark mb-4">Pseudo Code</h3>
              <div className="font-mono text-xs space-y-2">
                {pseudoCode.map((line, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-2 rounded transition-colors ${
                      currentStepData?.currentLine === idx + 1
                        ? "bg-paradigm-greedy text-white font-bold"
                        : "bg-muted/30 text-foreground"
                    }`}
                    animate={{
                      scale: currentStepData?.currentLine === idx + 1 ? 1.02 : 1,
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border border-paradigm-greedy p-4">
              <h3 className="text-sm font-semibold text-paradigm-greedy-dark mb-4">Distance Table</h3>
              <div className="space-y-2">
                {Object.entries(currentStepData?.distanceMatrix || {}).map(([node, dist]) => (
                  <div
                    key={node}
                    className={`flex justify-between items-center p-2 rounded text-sm font-mono ${
                      currentStepData?.currentNode === node
                        ? "bg-paradigm-greedy text-white font-bold"
                        : "bg-muted/30"
                    }`}
                  >
                    <span>{node}</span>
                    <span>{dist === Infinity ? "∞" : dist}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

export default Greedy;
