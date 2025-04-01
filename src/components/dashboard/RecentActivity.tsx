
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar, Users } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "session" | "room";
  date: Date;
  duration: number; // in seconds
  mode?: string;
  roomName?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const activityDate = new Date(date);
    
    if (
      activityDate.getDate() === today.getDate() &&
      activityDate.getMonth() === today.getMonth() &&
      activityDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      activityDate.getDate() === yesterday.getDate() &&
      activityDate.getMonth() === yesterday.getMonth() &&
      activityDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return activityDate.toLocaleDateString();
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const getActivityIcon = (type: string, mode?: string) => {
    if (type === "room") {
      return <Users className="h-4 w-4 text-studyflow-accent" />;
    } else if (mode === "pomodoro") {
      return <Clock className="h-4 w-4 text-red-500" />;
    } else {
      return <Clock className="h-4 w-4 text-studyflow-primary" />;
    }
  };
  
  const getActivityTitle = (activity: ActivityItem) => {
    if (activity.type === "room") {
      return `Study Room: ${activity.roomName || "Unnamed"}`;
    } else if (activity.mode === "pomodoro") {
      return "Pomodoro Session";
    } else {
      return "Focus Session";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Your latest study sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a timer or join a room to begin tracking
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-muted p-2 rounded-full">
                    {getActivityIcon(activity.type, activity.mode)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {getActivityTitle(activity)}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Studied for {formatTime(activity.duration)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
