
import React from "react";

interface TimerDisplayProps {
  timeLeft: number;
  isBreak: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, isBreak }) => {
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format with leading zeros
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-muted-foreground mb-2">
        {isBreak ? "Break Time" : "Focus Session"}
      </p>
      <div className="timer-display font-mono">
        {formattedMinutes}
        <span className="animate-pulse-light">:</span>
        {formattedSeconds}
      </div>
    </div>
  );
};

export default TimerDisplay;
