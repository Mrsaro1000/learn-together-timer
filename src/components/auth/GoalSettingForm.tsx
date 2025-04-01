
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const GoalSettingForm = () => {
  const [dailyGoal, setDailyGoal] = useState(120); // in minutes
  const [focusTime, setFocusTime] = useState("25"); // default Pomodoro time
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate setting goals - would connect to backend in real app
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
      localStorage.setItem("studyflow-user", JSON.stringify({
        ...userData,
        dailyGoal,
        focusTime: parseInt(focusTime)
      }));
      toast.success("Study goals set successfully!");
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Set Your Study Goals</CardTitle>
        <CardDescription className="text-center">Personalize your study experience</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Daily study goal: {dailyGoal} minutes
            </label>
            <Slider
              value={[dailyGoal]}
              min={30}
              max={360}
              step={30}
              onValueChange={(value) => setDailyGoal(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30m</span>
              <span>2h</span>
              <span>4h</span>
              <span>6h</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred focus session length</label>
            <Select value={focusTime} onValueChange={setFocusTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select session length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                <SelectItem value="50">50 minutes (Extended)</SelectItem>
                <SelectItem value="90">90 minutes (Deep work)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-studyflow-primary hover:bg-studyflow-accent" disabled={isLoading}>
              {isLoading ? "Saving goals..." : "Start studying"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        You can always change these settings later
      </CardFooter>
    </Card>
  );
};

export default GoalSettingForm;
