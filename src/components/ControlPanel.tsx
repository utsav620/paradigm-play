import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
}

const ControlPanel = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onReset,
  currentStep,
  totalSteps,
  speed = 1,
  onSpeedChange,
}: ControlPanelProps) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-card rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            onClick={onPrevious}
            disabled={currentStep === 0}
            variant="outline"
            size="icon"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          {isPlaying ? (
            <Button onClick={onPause} variant="default" size="icon">
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onPlay} variant="default" size="icon">
              <Play className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            variant="outline"
            size="icon"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button onClick={onReset} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {onSpeedChange && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Speed:</span>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={0.5}
            max={2}
            step={0.25}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground min-w-[3ch]">{speed}x</span>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
