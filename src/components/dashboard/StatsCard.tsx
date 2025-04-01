
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, Book, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: "time" | "goal" | "sessions" | "rooms";
  percentChange?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  percentChange,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "time":
        return <Clock className="h-5 w-5 text-studyflow-primary" />;
      case "goal":
        return <Target className="h-5 w-5 text-studyflow-accent" />;
      case "sessions":
        return <Book className="h-5 w-5 text-green-500" />;
      case "rooms":
        return <Users className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="mt-1 flex items-center text-xs">
          {description}
          {percentChange !== undefined && (
            <span className={`ml-2 ${percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentChange > 0 && "+"}
              {percentChange}%
            </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
