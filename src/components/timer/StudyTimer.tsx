
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";

type TimerMode = "pomodoro" | "focus";

const StudyTimer = () => {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breakTime, setBreakTime] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  // Get user preferences if available
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
    if (userData.focusTime) {
      const focusTimeInSeconds = userData.focusTime * 60;
      setTimeLeft(focusTimeInSeconds);
      setInitialTime(focusTimeInSeconds);
    }
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            
            if (!breakTime) {
              toast.success("Focus session completed! Take a break.");
              // Start break time
              setBreakTime(true);
              const breakDuration = mode === "pomodoro" ? 5 * 60 : 15 * 60;
              setTimeLeft(breakDuration);
              setInitialTime(breakDuration);
              return breakDuration;
            } else {
              // End break time
              toast.success("Break completed! Ready for another session?");
              setIsActive(false);
              setBreakTime(false);
              const focusTime = mode === "pomodoro" ? 25 * 60 : 50 * 60;
              setTimeLeft(focusTime);
              setInitialTime(focusTime);
              return focusTime;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, breakTime, mode]);

  const handleModeChange = (value: string) => {
    setMode(value as TimerMode);
    let newTime = 25 * 60; // default pomodoro
    
    if (value === "focus") {
      const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
      newTime = (userData.focusTime || 50) * 60;
    }
    
    setTimeLeft(newTime);
    setInitialTime(newTime);
    setIsActive(false);
    setBreakTime(false);
  };

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setBreakTime(false);
    setTimeLeft(initialTime);
  };

  const skipToBreak = () => {
    if (!breakTime && isActive) {
      // Record the completed session (would save to backend in real app)
      const sessionData = {
        date: new Date(),
        duration: initialTime - timeLeft,
        mode: mode
      };
      const existingSessions = JSON.parse(localStorage.getItem("studyflow-sessions") || "[]");
      localStorage.setItem("studyflow-sessions", JSON.stringify([...existingSessions, sessionData]));
      
      // Start break
      setBreakTime(true);
      const breakDuration = mode === "pomodoro" ? 5 * 60 : 15 * 60;
      setTimeLeft(breakDuration);
      setInitialTime(breakDuration);
      toast.success("Session recorded. Break started!");
    }
  };

  const finishSession = () => {
    // Save session data and navigate back to dashboard
    if (isActive && timeLeft < initialTime) {
      const sessionData = {
        date: new Date(),
        duration: initialTime - timeLeft,
        mode: mode
      };
      const existingSessions = JSON.parse(localStorage.getItem("studyflow-sessions") || "[]");
      localStorage.setItem("studyflow-sessions", JSON.stringify([...existingSessions, sessionData]));
      toast.success("Study session recorded!");
    }
    
    navigate("/dashboard");
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="max-w-md mx-auto py-8">
      <Tabs defaultValue="pomodoro" className="w-full" onValueChange={handleModeChange}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="focus">Focus Mode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pomodoro" className="mt-0">
          <Card className="border-2 border-studyflow-primary/20">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <TimerDisplay 
                timeLeft={timeLeft} 
                isBreak={breakTime} 
              />
              
              <Progress 
                value={progress} 
                className="w-full h-2 mt-6 mb-4 bg-studyflow-secondary"
                indicatorClassName={breakTime ? "bg-green-500" : "bg-studyflow-primary"}
              />
              
              <TimerControls 
                isActive={isActive}
                isPaused={isPaused}
                isBreak={breakTime}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onSkip={skipToBreak}
                onFinish={finishSession}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="focus" className="mt-0">
          <Card className="border-2 border-studyflow-primary/20">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <TimerDisplay 
                timeLeft={timeLeft}
                isBreak={breakTime}
              />
              
              <Progress 
                value={progress} 
                className="w-full h-2 mt-6 mb-4 bg-studyflow-secondary"
                indicatorClassName={breakTime ? "bg-green-500" : "bg-studyflow-accent"}
              />
              
              <TimerControls 
                isActive={isActive}
                isPaused={isPaused}
                isBreak={breakTime}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onSkip={skipToBreak}
                onFinish={finishSession}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyTimer;
