import { useState } from "react";
import { motion } from "framer-motion";
import ParadigmTabs from "@/components/ParadigmTabs";
import DivideConquer from "@/components/visualizers/DivideConquer";
import Greedy from "@/components/visualizers/Greedy";
import DynamicProgramming from "@/components/visualizers/DynamicProgramming";
import Backtracking from "@/components/visualizers/Backtracking";
import BranchBound from "@/components/visualizers/BranchBound";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("divide");

  const renderVisualizer = () => {
    switch (activeTab) {
      case "divide":
        return <DivideConquer />;
      case "greedy":
        return <Greedy />;
      case "dynamic":
        return <DynamicProgramming />;
      case "backtracking":
        return <Backtracking />;
      case "branch":
        return <BranchBound />;
      default:
        return <DivideConquer />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Paradigm Playground</h1>
              <p className="text-muted-foreground mt-1">
                Interactive Algorithm Paradigm Visualizer
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ParadigmTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {renderVisualizer()}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
