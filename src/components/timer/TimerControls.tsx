
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward, X } from "lucide-react";

interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  isBreak: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  isPaused,
  isBreak,
  onToggle,
  onReset,
  onSkip,
  onFinish,
}) => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2"
          onClick={onReset}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          variant={isPaused ? "outline" : "default"}
          size="icon"
          className={`h-16 w-16 rounded-full ${
            !isActive || isPaused
              ? "bg-studyflow-primary hover:bg-studyflow-accent text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
          onClick={onToggle}
        >
          {isActive && !isPaused ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </Button>
        
        {!isBreak && isActive ? (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2"
            onClick={onSkip}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2"
            onClick={onFinish}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        {isActive ? (
          isPaused ? (
            <span>Timer paused. Click play to resume.</span>
          ) : (
            isBreak ? (
              <span>Taking a break. Time to relax!</span>
            ) : (
              <span>Focus mode active. Stay concentrated!</span>
            )
          )
        ) : (
          <span>Click play to start your study session</span>
        )}
      </div>
    </div>
  );
};

export default TimerControls;
