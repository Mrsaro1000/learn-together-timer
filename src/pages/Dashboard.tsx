
import { useState, useEffect } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import StudyProgress from "@/components/dashboard/StudyProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Default user data
    const userData = {
      name: "Student",
      dailyGoal: 120
    };

    // Get session data from localStorage if available
    const sessionData = JSON.parse(localStorage.getItem("studyflow-sessions") || "[]");
    
    // Calculate today's minutes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessionData.filter((session: any) => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
    
    const totalSeconds = todaySessions.reduce(
      (total: number, session: any) => total + session.duration,
      0
    );
    
    setTodayMinutes(Math.round(totalSeconds / 60));
    
    // Get recent activities
    const recentActivities = sessionData
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((session: any) => ({
        id: session.date,
        type: session.mode === "room" ? "room" : "session",
        date: new Date(session.date),
        duration: session.duration,
        mode: session.mode,
        roomName: session.roomName || "Study Room",
      }));
    
    setActivities(recentActivities);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Today's Study Time"
          value={`${todayMinutes} min`}
          description="Total focused study time"
          icon="time"
          percentChange={5}
        />
        <StatsCard
          title="Daily Goal"
          value="120 min"
          description="Your target study time"
          icon="goal"
        />
        <StatsCard
          title="Total Sessions"
          value={`${activities.length}`}
          description="Completed study sessions"
          icon="sessions"
        />
        <StatsCard
          title="Study Rooms"
          value="3"
          description="Rooms you've joined"
          icon="rooms"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1">
          <StudyProgress
            targetMinutes={120}
            currentMinutes={todayMinutes}
          />
        </div>
        <div className="col-span-1">
          <QuickActions />
        </div>
        <div className="col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
