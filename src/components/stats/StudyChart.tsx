
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";

interface StudySession {
  date: Date;
  duration: number; // in seconds
}

interface ChartDataItem {
  name: string;
  minutes: number;
  date: Date;
}

interface StudyChartProps {
  sessions: StudySession[];
  title: string;
  description: string;
  period: "week" | "month";
}

const StudyChart: React.FC<StudyChartProps> = ({ sessions, title, description, period }) => {
  const getChartData = (): ChartDataItem[] => {
    if (period === "week") {
      const startDate = startOfWeek(new Date());
      return Array.from({ length: 7 }).map((_, index) => {
        const date = addDays(startDate, index);
        const dayName = format(date, "EEE");
        
        const dayTotal = sessions
          .filter((session) => isSameDay(new Date(session.date), date))
          .reduce((total, session) => total + session.duration, 0);
        
        return {
          name: dayName,
          minutes: Math.round(dayTotal / 60),
          date,
        };
      });
    } else {
      // Month logic would be implemented here
      return [];
    }
  };

  const data = getChartData();
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ChartDataItem;
      const isCurrentDay = isToday(dataPoint.date);
      
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{format(dataPoint.date, "E, MMM d")}</p>
          <p className="text-studyflow-primary font-medium">
            {payload[0].value} minutes
          </p>
          {isCurrentDay && <p className="text-xs text-muted-foreground">Today</p>}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              unit="m" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="minutes" 
              fill="rgba(155, 135, 245, 0.8)" 
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudyChart;
