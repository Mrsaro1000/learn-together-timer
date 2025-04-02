
import { useState, useEffect, useRef } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import StudyProgress from "@/components/dashboard/StudyProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(120); // Default daily goal
  const [progressChange, setProgressChange] = useState(0);
  
  // Initialize user data if not exists
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
    
    if (!userData.id) {
      const newUser = {
        id: "user-" + Date.now(),
        name: userData.name || "Student",
        dailyGoal: userData.dailyGoal || 120,
      };
      
      localStorage.setItem("studyflow-user", JSON.stringify(newUser));
    }
  }, []);

  useEffect(() => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
    setDailyGoal(userData.dailyGoal || 120);
    
    // Get session data from localStorage
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
    
    const minutesStudied = Math.round(totalSeconds / 60);
    setTodayMinutes(minutesStudied);
    
    // Calculate progress change (compared to yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdaySessions = sessionData.filter((session: any) => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === yesterday.getTime();
    });
    
    const yesterdaySeconds = yesterdaySessions.reduce(
      (total: number, session: any) => total + session.duration,
      0
    );
    
    const yesterdayMinutes = Math.round(yesterdaySeconds / 60);
    
    if (yesterdayMinutes > 0) {
      const change = Math.round(((minutesStudied - yesterdayMinutes) / yesterdayMinutes) * 100);
      setProgressChange(change);
    }
    
    // Get total sessions count
    setTotalSessions(sessionData.length);
    
    // Get study rooms count
    const rooms = JSON.parse(localStorage.getItem("studyflow-rooms") || "[]");
    setTotalRooms(rooms.length);
    
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
          percentChange={progressChange}
        />
        <StatsCard
          title="Daily Goal"
          value={`${dailyGoal} min`}
          description="Your target study time"
          icon="goal"
        />
        <StatsCard
          title="Total Sessions"
          value={`${totalSessions}`}
          description="Completed study sessions"
          icon="sessions"
        />
        <StatsCard
          title="Study Rooms"
          value={`${totalRooms}`}
          description="Rooms you've joined"
          icon="rooms"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1">
          <StudyProgress
            targetMinutes={dailyGoal}
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
