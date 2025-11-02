import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, Lightbulb, Grid3x3, GitMerge, Table } from "lucide-react";

interface ParadigmTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const paradigms = [
  {
    id: "divide",
    label: "Divide & Conquer",
    icon: GitMerge,
    color: "paradigm-divide",
  },
  {
    id: "greedy",
    label: "Greedy",
    icon: Lightbulb,
    color: "paradigm-greedy",
  },
  {
    id: "dynamic",
    label: "Dynamic Programming",
    icon: Table,
    color: "paradigm-dynamic",
  },
  {
    id: "backtracking",
    label: "Backtracking",
    icon: GitBranch,
    color: "paradigm-backtrack",
  },
  {
    id: "branch",
    label: "Branch & Bound",
    icon: Grid3x3,
    color: "paradigm-branch",
  },
];

const ParadigmTabs = ({ activeTab, onTabChange }: ParadigmTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-2 bg-card border border-border">
        {paradigms.map((paradigm) => {
          const Icon = paradigm.icon;
          const isActive = activeTab === paradigm.id;
          
          return (
            <TabsTrigger
              key={paradigm.id}
              value={paradigm.id}
              className="relative flex flex-col items-center gap-2 py-4 px-3 data-[state=active]:shadow-lg transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-${paradigm.color}-light rounded-md`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={`h-5 w-5 relative z-10 transition-colors ${
                  isActive ? `text-${paradigm.color}` : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium relative z-10 transition-colors text-center ${
                  isActive ? `text-${paradigm.color}-dark` : "text-muted-foreground"
                }`}
              >
                {paradigm.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default ParadigmTabs;
