import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";

interface Step {
  table: (number | null)[][];
  currentCell: [number, number] | null;
  description: string;
}

const DynamicProgramming = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const n = 10; // Calculate Fibonacci up to F(10)

  // Generate Fibonacci DP steps
  useEffect(() => {
    const generatedSteps: Step[] = [];
    const table: (number | null)[][] = Array(2)
      .fill(null)
      .map(() => Array(n + 1).fill(null));

    generatedSteps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: null,
      description: "Initialize empty table for Fibonacci sequence",
    });

    // Base cases
    table[0][0] = 0;
    table[0][1] = 1;
    generatedSteps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: [0, 0],
      description: "Base case: F(0) = 0",
    });

    generatedSteps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: [0, 1],
      description: "Base case: F(1) = 1",
    });

    // Fill the table
    for (let i = 2; i <= n; i++) {
      table[0][i] = table[0][i - 1]! + table[0][i - 2]!;
      generatedSteps.push({
        table: JSON.parse(JSON.stringify(table)),
        currentCell: [0, i],
        description: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${table[0][i - 1]} + ${table[0][i - 2]} = ${table[0][i]}`,
      });
    }

    generatedSteps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: null,
      description: `Complete! F(${n}) = ${table[0][n]}`,
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
      <Card className="p-8 bg-paradigm-dynamic-light border-paradigm-dynamic">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-paradigm-dynamic-dark mb-2">
              Fibonacci - Dynamic Programming
            </h2>
            <p className="text-sm text-muted-foreground">
              Watch how the table is filled iteratively, building solutions from smaller subproblems.
            </p>
          </div>

          {/* Table Visualization */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 justify-center py-8">
              {currentStepData?.table[0].map((value, index) => {
                const isCurrent =
                  currentStepData.currentCell &&
                  currentStepData.currentCell[0] === 0 &&
                  currentStepData.currentCell[1] === index;

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

          {/* Recursion Tree Hint */}
          <div className="p-4 bg-card rounded-lg border border-paradigm-dynamic">
            <p className="text-xs text-center text-muted-foreground">
              💡 DP avoids redundant calculations by storing computed values
            </p>
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
