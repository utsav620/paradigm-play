import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface TreeNode {
  array: number[];
  x: number;
  y: number;
  children?: TreeNode[];
  isMerging?: boolean;
}

interface Step {
  array: number[];
  highlight: number[];
  description: string;
  level: number;
  tree?: TreeNode;
  currentNode?: TreeNode | null;
  currentLine: number | null;
}

const DivideConquer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const initialArray = [38, 27, 43, 3, 9, 82, 10];

  useEffect(() => {
    const generatedSteps: Step[] = [];

    // Build tree structure
    const buildTree = (arr: number[], x: number, y: number, width: number): TreeNode => {
      if (arr.length <= 1) {
        return { array: arr, x, y };
      }
      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);

      return {
        array: arr,
        x,
        y,
        children: [
          buildTree(left, x - width, y + 120, width / 2),
          buildTree(right, x + width, y + 120, width / 2),
        ],
      };
    };

    const tree = buildTree([...initialArray], 400, 60, 200);

    generatedSteps.push({
      array: [...initialArray],
      highlight: [],
      description: "Initial unsorted array - starting merge sort",
      level: 0,
      tree: JSON.parse(JSON.stringify(tree)),
      currentNode: tree,
      currentLine: null,
    });

    const mergeSort = (arr: number[], start: number, level: number, node: TreeNode): number[] => {
      generatedSteps.push({
        array: [...initialArray],
        highlight: Array.from({ length: arr.length }, (_, i) => start + i),
        description: arr.length > 1 ? `Divide: [${arr.join(", ")}]` : `Base case: [${arr[0]}]`,
        level,
        tree: JSON.parse(JSON.stringify(tree)),
        currentNode: node,
        currentLine: arr.length > 1 ? 1 : 2,
      });

      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);

      const sortedLeft = mergeSort(left, start, level + 1, node.children![0]);
      const sortedRight = mergeSort(right, start + mid, level + 1, node.children![1]);

      return merge(sortedLeft, sortedRight, start, level, node);
    };

    const merge = (left: number[], right: number[], start: number, level: number, node: TreeNode): number[] => {
      const result: number[] = [];
      let i = 0, j = 0;

      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }

      const merged = [...result, ...left.slice(i), ...right.slice(j)];
      const mergeNode = { ...node, isMerging: true };

      generatedSteps.push({
        array: [...initialArray].map((val, idx) => {
          if (idx >= start && idx < start + merged.length) return merged[idx - start];
          return val;
        }),
        highlight: Array.from({ length: merged.length }, (_, i) => start + i),
        description: `Merge: [${merged.join(", ")}]`,
        level,
        tree: JSON.parse(JSON.stringify(tree)),
        currentNode: mergeNode,
        currentLine: 3,
      });

      return merged;
    };

    mergeSort([...initialArray], 0, 0, tree);

    generatedSteps.push({
      array: generatedSteps[generatedSteps.length - 1].array,
      highlight: [],
      description: "Array is now fully sorted!",
      level: 0,
      tree: JSON.parse(JSON.stringify(tree)),
      currentNode: null,
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
    "if array.length <= 1: return array",
    "  // Base case - already sorted",
    "mid = array.length / 2",
    "left = mergeSort(array[0:mid])",
    "right = mergeSort(array[mid:])",
    "return merge(left, right)",
    "  // Combine sorted halves",
  ];

  const renderTree = (node: TreeNode | undefined): JSX.Element | null => {
    if (!node) return null;
    const isCurrent = currentStepData.currentNode?.x === node.x && currentStepData.currentNode?.y === node.y;
    const arrayStr = node.array.join(", ");
    const rectWidth = Math.max(100, node.array.length * 25);

    return (
      <g key={`${node.x}-${node.y}`}>
        {node.children?.map((child, idx) => (
          <line
            key={idx}
            x1={node.x}
            y1={node.y + 25}
            x2={child.x}
            y2={child.y - 25}
            stroke="hsl(var(--divide-conquer) / 0.4)"
            strokeWidth="2"
          />
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: isCurrent ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <rect
            x={node.x - rectWidth / 2}
            y={node.y - 20}
            width={rectWidth}
            height="40"
            rx="8"
            fill={isCurrent ? "hsl(var(--divide-conquer))" : "hsl(var(--card))"}
            stroke="hsl(var(--divide-conquer))"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill={isCurrent ? "white" : "hsl(var(--divide-conquer-dark))"}
            fontSize="12"
            fontWeight="bold"
          >
            [{arrayStr}]
          </text>
        </motion.g>
        {node.children?.map((child) => renderTree(child))}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-paradigm-divide-light border-paradigm-divide">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Visualizations */}
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-paradigm-divide-dark mb-2">
                Merge Sort - Divide & Conquer
              </h2>
              <p className="text-sm text-muted-foreground">
                Watch how the array is recursively divided into smaller parts, then merged back together in sorted order.
              </p>
            </div>

            {/* Recursion Tree */}
            <div className="bg-card rounded-lg border border-paradigm-divide p-4">
              <h3 className="text-sm font-semibold text-paradigm-divide-dark mb-4">Recursion Tree (Divide Phase)</h3>
              <svg className="w-full h-[600px]">
                {renderTree(currentStepData?.tree)}
              </svg>
            </div>

            {/* Array Visualization */}
            <div className="flex justify-center items-end gap-2 h-64 py-4">
              <AnimatePresence mode="wait">
                {currentStepData?.array.map((value, index) => {
                  const isHighlighted = currentStepData.highlight.includes(index);
                  const maxValue = Math.max(...initialArray);
                  const height = (value / maxValue) * 200;
                  const getSubArrayColor = (idx: number) => [
                    "hsl(210, 100%, 56%)",
                    "hsl(142, 76%, 36%)",
                    "hsl(262, 83%, 58%)",
                    "hsl(346, 77%, 50%)",
                    "hsl(43, 96%, 56%)",
                    "hsl(173, 80%, 40%)",
                    "hsl(24, 100%, 50%)",
                  ][idx % 7];

                  const subArrayIndex = Math.floor(index / Math.max(1, 7 / (currentStepData.level + 1)));
                  const bgColor = isHighlighted ? getSubArrayColor(subArrayIndex) : "hsl(var(--divide-conquer) / 0.2)";

                  return (
                    <motion.div
                      key={`${index}-${value}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1, backgroundColor: bgColor }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-2 flex-1 max-w-[80px]"
                    >
                      <div
                        style={{ height: `${height}px` }}
                        className="w-full rounded-t-md flex items-end justify-center pb-2"
                      >
                        <span className="text-white font-bold text-sm">{value}</span>
                      </div>
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
              className="p-4 bg-card rounded-lg border border-paradigm-divide"
            >
              <p className="text-center text-paradigm-divide-dark font-medium">
                {currentStepData?.description}
              </p>
            </motion.div>
          </div>

          {/* Right Column - Pseudo Code */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-paradigm-divide p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-paradigm-divide-dark mb-4">Pseudo Code</h3>
              <div className="font-mono text-xs space-y-2">
                {pseudoCode.map((line, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-2 rounded transition-colors ${
                      currentStepData?.currentLine === idx + 1
                        ? "bg-paradigm-divide text-white font-bold"
                        : "bg-muted/30 text-foreground"
                    }`}
                    animate={{ scale: currentStepData?.currentLine === idx + 1 ? 1.02 : 1 }}
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

export default DivideConquer;
