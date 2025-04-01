
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, BarChart2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Start studying or check your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-1 hover:bg-studyflow-secondary hover:text-foreground"
            onClick={() => navigate("/timer")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs font-normal">Start Timer</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-1 hover:bg-studyflow-secondary hover:text-foreground"
            onClick={() => navigate("/rooms")}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs font-normal">Join Room</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-1 hover:bg-studyflow-secondary hover:text-foreground"
            onClick={() => navigate("/stats")}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="text-xs font-normal">View Stats</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-1 hover:bg-studyflow-secondary hover:text-foreground"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-normal">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
