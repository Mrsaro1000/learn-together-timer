
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Unlock, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudyRoomCardProps {
  id: string;
  name: string;
  participants: number;
  maxParticipants: number;
  isPrivate: boolean;
  subject?: string;
  activeTime?: number; // in minutes
}

const StudyRoomCard: React.FC<StudyRoomCardProps> = ({
  id,
  name,
  participants,
  maxParticipants,
  isPrivate,
  subject,
  activeTime = 0,
}) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/rooms/${id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-1">{subject || "General study"}</CardDescription>
          </div>
          <Badge variant={isPrivate ? "outline" : "secondary"} className="flex items-center gap-1">
            {isPrivate ? (
              <>
                <Lock className="h-3 w-3" /> Private
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3" /> Public
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {participants}/{maxParticipants} participants
            </span>
          </div>
          {activeTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Active for {activeTime}m</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handleJoin} 
          className="w-full bg-studyflow-primary hover:bg-studyflow-accent"
        >
          Join Room
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyRoomCard;
