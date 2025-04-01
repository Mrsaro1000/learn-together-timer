
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StudyProgressProps {
  targetMinutes: number;
  currentMinutes: number;
}

const StudyProgress: React.FC<StudyProgressProps> = ({
  targetMinutes,
  currentMinutes,
}) => {
  const progressPercentage = Math.min(
    Math.round((currentMinutes / targetMinutes) * 100),
    100
  );

  const remainingMinutes = Math.max(targetMinutes - currentMinutes, 0);
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Progress</CardTitle>
        <CardDescription>
          {progressPercentage}% of your daily goal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {formatTime(currentMinutes)} studied
            </span>
            <span className="text-muted-foreground">
              Goal: {formatTime(targetMinutes)}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {remainingMinutes > 0 ? (
          <p className="text-sm text-muted-foreground">
            {formatTime(remainingMinutes)} left to meet your daily goal
          </p>
        ) : (
          <p className="text-sm font-medium text-green-500">
            Daily goal complete! 🎉
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyProgress;
