import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface TreeNode {
  value: number;
  computed: boolean;
  x: number;
  y: number;
  children?: TreeNode[];
}

interface Step {
  memo: (number | null)[];
  currentIndex: number | null;
  tree: TreeNode;
  description: string;
  memoHits: Set<number>;
}

const DynamicProgramming = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const n = 7; // Calculate Fibonacci up to F(7) for better tree visibility

  // Generate Fibonacci Memoization steps
  useEffect(() => {
    const generatedSteps: Step[] = [];
    const memo: (number | null)[] = Array(n + 1).fill(null);
    const memoHits = new Set<number>();

    // Build recursion tree structure
    const buildTree = (num: number, x: number, y: number, width: number): TreeNode => {
      if (num <= 1) {
        return { value: num, computed: false, x, y };
      }
      return {
        value: num,
        computed: false,
        x,
        y,
        children: [
          buildTree(num - 1, x - width, y + 80, width / 2),
          buildTree(num - 2, x + width, y + 80, width / 2),
        ],
      };
    };

    const tree = buildTree(n, 400, 50, 150);

    generatedSteps.push({
      memo: [...memo],
      currentIndex: null,
      tree: JSON.parse(JSON.stringify(tree)),
      description: `Computing Fibonacci(${n}) using memoization`,
      memoHits: new Set(memoHits),
    });

    // Simulate memoization computation
    const computeFib = (num: number, currentTree: TreeNode): number => {
      generatedSteps.push({
        memo: [...memo],
        currentIndex: num,
        tree: JSON.parse(JSON.stringify(tree)),
        description: `Checking F(${num})...`,
        memoHits: new Set(memoHits),
      });

      if (memo[num] !== null) {
        memoHits.add(num);
        generatedSteps.push({
          memo: [...memo],
          currentIndex: num,
          tree: JSON.parse(JSON.stringify(tree)),
          description: `F(${num}) already computed: ${memo[num]} (from memo) ✨`,
          memoHits: new Set(memoHits),
        });
        return memo[num]!;
      }

      if (num <= 1) {
        memo[num] = num;
        generatedSteps.push({
          memo: [...memo],
          currentIndex: num,
          tree: JSON.parse(JSON.stringify(tree)),
          description: `Base case: F(${num}) = ${num}`,
          memoHits: new Set(memoHits),
        });
        return num;
      }

      const fib1 = computeFib(num - 1, currentTree);
      const fib2 = computeFib(num - 2, currentTree);
      memo[num] = fib1 + fib2;

      generatedSteps.push({
        memo: [...memo],
        currentIndex: num,
        tree: JSON.parse(JSON.stringify(tree)),
        description: `F(${num}) = F(${num - 1}) + F(${num - 2}) = ${fib1} + ${fib2} = ${memo[num]}`,
        memoHits: new Set(memoHits),
      });

      return memo[num]!;
    };

    computeFib(n, tree);

    generatedSteps.push({
      memo: [...memo],
      currentIndex: null,
      tree: JSON.parse(JSON.stringify(tree)),
      description: `Complete! F(${n}) = ${memo[n]}`,
      memoHits: new Set(memoHits),
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

  const renderTree = (node: TreeNode | undefined, currentIdx: number | null): JSX.Element | null => {
    if (!node) return null;

    const isCurrent = node.value === currentIdx;
    const isComputed = currentStepData.memo[node.value] !== null;
    const isMemoHit = currentStepData.memoHits.has(node.value);

    return (
      <g key={`${node.x}-${node.y}-${node.value}`}>
        {node.children?.map((child, idx) => (
          <line
            key={idx}
            x1={node.x}
            y1={node.y}
            x2={child.x}
            y2={child.y}
            stroke="hsl(var(--dynamic-prog) / 0.3)"
            strokeWidth="2"
          />
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: isCurrent ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="20"
            fill={
              isCurrent
                ? "hsl(var(--dynamic-prog))"
                : isMemoHit
                ? "hsl(43, 96%, 56%)"
                : isComputed
                ? "hsl(var(--dynamic-prog-dark))"
                : "hsl(var(--card))"
            }
            stroke="hsl(var(--dynamic-prog))"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {node.value}
          </text>
        </motion.g>
        {node.children?.map((child) => renderTree(child, currentIdx))}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-paradigm-dynamic-light border-paradigm-dynamic">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-paradigm-dynamic-dark mb-2">
              Fibonacci - Dynamic Programming (Memoization)
            </h2>
            <p className="text-sm text-muted-foreground">
              Watch the recursion tree and see how memoization avoids redundant calculations.
            </p>
          </div>

          {/* Recursion Tree */}
          <div className="bg-card rounded-lg border border-paradigm-dynamic p-4">
            <h3 className="text-sm font-semibold text-paradigm-dynamic-dark mb-4">Recursion Tree</h3>
            <svg className="w-full h-96">
              {renderTree(currentStepData?.tree, currentStepData?.currentIndex)}
            </svg>
          </div>

          {/* Memoization Table */}
          <div className="bg-card rounded-lg border border-paradigm-dynamic p-4">
            <h3 className="text-sm font-semibold text-paradigm-dynamic-dark mb-4">
              Memoization Array (DP Table)
            </h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {currentStepData?.memo.map((value, index) => {
                const isCurrent = currentStepData.currentIndex === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: value !== null ? 1 : 0.3,
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-muted-foreground font-mono">F({index})</span>
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                        isCurrent
                          ? "bg-paradigm-dynamic border-paradigm-dynamic text-white"
                          : value !== null
                          ? "bg-paradigm-dynamic-light border-paradigm-dynamic text-paradigm-dynamic-dark"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {value !== null ? value : "-"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Hint */}
          <div className="p-4 bg-card rounded-lg border border-paradigm-dynamic">
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-paradigm-dynamic-dark border-2 border-paradigm-dynamic"></div>
                <span>Raw Calculation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-paradigm-dynamic" style={{ backgroundColor: "hsl(43, 96%, 56%)" }}></div>
                <span>Memoization Hit ✨</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card rounded-lg border border-paradigm-dynamic"
          >
            <p className="text-center text-paradigm-dynamic-dark font-medium">
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

export default DynamicProgramming;
