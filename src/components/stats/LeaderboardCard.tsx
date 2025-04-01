
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  minutesStudied: number;
  streak: number;
  rank: number;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
  currentUserId: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ users, currentUserId }) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Badge className="bg-yellow-500">🥇</Badge>;
    } else if (rank === 2) {
      return <Badge className="bg-gray-400">🥈</Badge>;
    } else if (rank === 3) {
      return <Badge className="bg-amber-700">🥉</Badge>;
    }
    return <Badge variant="outline">{rank}</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leaderboard</CardTitle>
        <CardDescription>Top studiers this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-2 rounded-md ${
                  user.id === currentUserId ? "bg-studyflow-secondary" : ""
                }`}
              >
                <div className="w-8 flex justify-center">{getRankBadge(user.rank)}</div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-studyflow-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.name}
                    {user.id === currentUserId && " (You)"}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{formatTime(user.minutesStudied)} studied</span>
                    {user.streak > 1 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {user.streak} day streak 🔥
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
