
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StudyChart from "@/components/stats/StudyChart";
import LeaderboardCard from "@/components/stats/LeaderboardCard";

const Stats = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  
  useEffect(() => {
    // Get session data from local storage
    const sessionData = JSON.parse(localStorage.getItem("studyflow-sessions") || "[]");
    
    // Convert string dates to Date objects and ensure all required properties exist
    const processedSessions = sessionData.map((session: any) => ({
      ...session,
      date: new Date(session.date),
      duration: session.duration || 0,
      mode: session.mode || "focus",
      roomId: session.roomId || null,
      roomName: session.roomName || "Study Room"
    }));
    
    setSessions(processedSessions);
  }, []);

  // Demo leaderboard data
  const leaderboardData = [
    {
      id: "1",
      name: "Emma Johnson",
      minutesStudied: 480,
      streak: 5,
      rank: 1,
    },
    {
      id: "current",
      name: "You",
      minutesStudied: calculateTotalMinutesStudied(sessions),
      streak: 3,
      rank: 2,
    },
    {
      id: "3",
      name: "Michael Smith",
      minutesStudied: 320,
      streak: 4,
      rank: 3,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      minutesStudied: 280,
      streak: 2,
      rank: 4,
    },
    {
      id: "5",
      name: "James Brown",
      minutesStudied: 240,
      streak: 1,
      rank: 5,
    },
  ];

  // Calculate total minutes studied from seconds
  function calculateTotalMinutesStudied(sessions: any[]) {
    const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
    return Math.floor(totalSeconds / 60);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Study Statistics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="week">
            <TabsList className="mb-4">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
            <TabsContent value="week">
              <StudyChart
                sessions={sessions}
                title="Weekly Study Time"
                description="Your daily study time for the past week"
                period="week"
              />
            </TabsContent>
            <TabsContent value="month">
              <StudyChart
                sessions={sessions}
                title="Monthly Study Time"
                description="Your study time for the past month"
                period="month"
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <LeaderboardCard users={leaderboardData} currentUserId="current" />
        </div>
      </div>
    </div>
  );
};

export default Stats;
