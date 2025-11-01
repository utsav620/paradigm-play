import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface Step {
  array: number[];
  highlight: number[];
  description: string;
  level: number;
}

const DivideConquer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const initialArray = [38, 27, 43, 3, 9, 82, 10];

  // Generate merge sort steps
  useEffect(() => {
    const generatedSteps: Step[] = [];
    generatedSteps.push({
      array: [...initialArray],
      highlight: [],
      description: "Initial unsorted array",
      level: 0,
    });

    const mergeSort = (arr: number[], start: number, level: number): number[] => {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);

      generatedSteps.push({
        array: [...initialArray],
        highlight: Array.from({ length: arr.length }, (_, i) => start + i),
        description: `Divide: Splitting array at position ${mid}`,
        level,
      });

      const sortedLeft = mergeSort(left, start, level + 1);
      const sortedRight = mergeSort(right, start + mid, level + 1);

      const merged = merge(sortedLeft, sortedRight, start, level);
      return merged;
    };

    const merge = (left: number[], right: number[], start: number, level: number): number[] => {
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
      
      generatedSteps.push({
        array: [...initialArray].map((val, idx) => {
          if (idx >= start && idx < start + merged.length) {
            return merged[idx - start];
          }
          return val;
        }),
        highlight: Array.from({ length: merged.length }, (_, i) => start + i),
        description: `Merge: Combining sorted subarrays`,
        level,
      });

      return merged;
    };

    mergeSort([...initialArray], 0, 0);
    generatedSteps.push({
      array: generatedSteps[generatedSteps.length - 1].array,
      highlight: [],
      description: "Array is now fully sorted!",
      level: 0,
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
      <Card className="p-8 bg-paradigm-divide-light border-paradigm-divide">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-paradigm-divide-dark mb-2">
              Merge Sort - Divide & Conquer
            </h2>
            <p className="text-sm text-muted-foreground">
              Watch how the array is recursively divided into smaller parts, then merged back together in sorted order.
            </p>
          </div>

          {/* Array Visualization */}
          <div className="flex justify-center items-end gap-2 h-64 py-4">
            <AnimatePresence mode="wait">
              {currentStepData?.array.map((value, index) => {
                const isHighlighted = currentStepData.highlight.includes(index);
                const maxValue = Math.max(...initialArray);
                const height = (value / maxValue) * 200;
                
                // Assign different colors to different sub-arrays
                const getSubArrayColor = (idx: number) => {
                  const colors = [
                    "hsl(210, 100%, 56%)", // blue
                    "hsl(142, 76%, 36%)",  // green
                    "hsl(262, 83%, 58%)",  // purple
                    "hsl(346, 77%, 50%)",  // red
                    "hsl(43, 96%, 56%)",   // yellow
                    "hsl(173, 80%, 40%)",  // teal
                    "hsl(24, 100%, 50%)",  // orange
                  ];
                  return colors[idx % colors.length];
                };

                const subArrayIndex = Math.floor(index / Math.max(1, 7 / (currentStepData.level + 1)));
                const bgColor = isHighlighted 
                  ? getSubArrayColor(subArrayIndex)
                  : "hsl(var(--divide-conquer) / 0.2)";

                return (
                  <motion.div
                    key={`${index}-${value}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      backgroundColor: bgColor
                    }}
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
