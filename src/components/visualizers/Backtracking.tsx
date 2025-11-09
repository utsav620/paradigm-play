import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface TreeNode {
  value: string;
  x: number;
  y: number;
  isBacktrack: boolean;
  isComplete: boolean;
  children?: TreeNode[];
}

interface Step {
  tree: TreeNode;
  currentPath: string;
  description: string;
  permutations: string[];
  currentLine: number | null;
}

const Backtracking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const elements = ["A", "B", "C"];

  useEffect(() => {
    const generatedSteps: Step[] = [];
    const permutations: string[] = [];

    // Build the tree structure
    const buildTree = (
      path: string[],
      remaining: string[],
      x: number,
      y: number,
      width: number
    ): TreeNode => {
      const value = path.length === 0 ? "[]" : `[${path.join(",")}]`;
      const isComplete = path.length === elements.length;

      if (isComplete) {
        return {
          value,
          x,
          y,
          isBacktrack: false,
          isComplete: true,
        };
      }

      const children: TreeNode[] = [];
      const childWidth = width / remaining.length;

      remaining.forEach((element, idx) => {
        const newPath = [...path, element];
        const newRemaining = remaining.filter((e) => e !== element);
        const childX = x - width / 2 + childWidth * idx + childWidth / 2;
        children.push(buildTree(newPath, newRemaining, childX, y + 100, childWidth));
      });

      return {
        value,
        x,
        y,
        isBacktrack: false,
        isComplete: false,
        children,
      };
    };

    const tree = buildTree([], elements, 400, 50, 600);

    // Generate steps by traversing the tree
    const traverse = (node: TreeNode, path: string[]) => {
      generatedSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        currentPath: node.value,
        description: path.length === 0 ? "Start: empty permutation" : `Exploring: ${node.value}`,
        permutations: [...permutations],
        currentLine: 1,
      });

      if (node.isComplete) {
        permutations.push(node.value);
        generatedSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          currentPath: node.value,
          description: `✓ Found permutation: ${node.value}`,
          permutations: [...permutations],
          currentLine: 2,
        });

        generatedSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          currentPath: node.value,
          description: `Backtracking from ${node.value}...`,
          permutations: [...permutations],
          currentLine: 3,
        });
        return;
      }

      if (node.children) {
        node.children.forEach((child) => {
          traverse(child, [...path, child.value]);
        });
      }

      if (path.length > 0) {
        generatedSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          currentPath: node.value,
          description: `Backtracking from ${node.value}...`,
          permutations: [...permutations],
          currentLine: 3,
        });
      }
    };

    generatedSteps.push({
      tree: JSON.parse(JSON.stringify(tree)),
      currentPath: "",
      description: "Generating all permutations of [A, B, C]",
      permutations: [],
      currentLine: null,
    });

    traverse(tree, []);

    generatedSteps.push({
      tree: JSON.parse(JSON.stringify(tree)),
      currentPath: "",
      description: `Complete! Found ${permutations.length} permutations`,
      permutations: [...permutations],
      currentLine: null,
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

  const pseudoCode = [
    "for each element in choices:",
    "  if element not in path:",
    "    add element to path",
    "    if path is complete:",
    "      save solution",
    "    else:",
    "      recurse with remaining choices",
    "    remove element from path  // Backtrack",
  ];

  const renderTree = (node: TreeNode | undefined): JSX.Element | null => {
    if (!node) return null;

    const isCurrent = node.value === currentStepData?.currentPath;

    return (
      <g key={`${node.x}-${node.y}`}>
        {node.children?.map((child, idx) => (
          <line
            key={idx}
            x1={node.x}
            y1={node.y}
            x2={child.x}
            y2={child.y}
            stroke="hsl(var(--backtracking) / 0.3)"
            strokeWidth="2"
          />
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: isCurrent ? 1.15 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <rect
            x={node.x - 30}
            y={node.y - 15}
            width="60"
            height="30"
            rx="5"
            fill={
              isCurrent
                ? "hsl(var(--backtracking))"
                : node.isComplete
                ? "hsl(var(--backtracking-dark))"
                : "hsl(var(--card))"
            }
            stroke="hsl(var(--backtracking))"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill={isCurrent || node.isComplete ? "white" : "hsl(var(--foreground))"}
            fontSize="10"
            fontWeight="bold"
          >
            {node.value}
          </text>
        </motion.g>
        {node.children?.map((child) => renderTree(child))}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-paradigm-backtrack-light border-paradigm-backtrack">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Visualizations */}
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-paradigm-backtrack-dark mb-2">
                Permutation Generation - Backtracking
              </h2>
              <p className="text-sm text-muted-foreground">
                Watch how the algorithm explores branches and backtracks to find all permutations.
              </p>
            </div>

            {/* Tree Visualization */}
            <div className="bg-card rounded-lg border border-paradigm-backtrack p-4 overflow-x-auto">
              <svg className="w-full h-96 min-w-[800px]">
                {renderTree(currentStepData?.tree)}
              </svg>
            </div>

            {/* Found Permutations */}
            <div className="bg-card rounded-lg border border-paradigm-backtrack p-4">
              <h3 className="text-sm font-semibold text-paradigm-backtrack-dark mb-3">
                Found Permutations ({currentStepData?.permutations.length || 0})
              </h3>
              <div className="flex gap-2 flex-wrap">
                {currentStepData?.permutations.map((perm, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-paradigm-backtrack-light border border-paradigm-backtrack rounded-md text-sm font-mono text-paradigm-backtrack-dark"
                  >
                    {perm}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Step Description */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-card rounded-lg border border-paradigm-backtrack"
            >
              <p className="text-center text-paradigm-backtrack-dark font-medium">
                {currentStepData?.description}
              </p>
            </motion.div>
          </div>

          {/* Right Column - Pseudo Code */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-paradigm-backtrack p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-paradigm-backtrack-dark mb-4">Pseudo Code</h3>
              <div className="font-mono text-xs space-y-2">
                {pseudoCode.map((line, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-2 rounded transition-colors ${
                      currentStepData?.currentLine === idx + 1
                        ? "bg-paradigm-backtrack text-white font-bold"
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

export default Backtracking;
