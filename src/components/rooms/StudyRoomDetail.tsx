
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import TaskList from "./TaskList";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderInitials: string;
  text: string;
  timestamp: Date;
}

const StudyRoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | null>(null);
  const [roomTime, setRoomTime] = useState(0); // in seconds

  useEffect(() => {
    // In a real app, we would fetch the room from a backend
    const rooms = JSON.parse(localStorage.getItem("studyflow-rooms") || "[]");
    const foundRoom = rooms.find((r: any) => r.id === roomId);
    
    if (foundRoom) {
      setRoom(foundRoom);
      setTasks(foundRoom.tasks || []);
      
      // Start a timer to track time spent in the room
      const timer = setInterval(() => {
        setRoomTime((prev) => prev + 1);
      }, 1000);
      
      setActiveTimer(timer);
      
      // Add a system message
      const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
      const userName = userData.name || "Anonymous";
      
      setChatMessages([
        {
          id: Date.now().toString(),
          sender: "System",
          senderInitials: "SY",
          text: `${userName} joined the room`,
          timestamp: new Date(),
        },
      ]);
    } else {
      toast.error("Study room not found");
      navigate("/rooms");
    }
    
    return () => {
      if (activeTimer) {
        clearInterval(activeTimer);
      }
      
      // In a real app, this would update session time on the server
      if (roomTime > 0) {
        const existingSessions = JSON.parse(localStorage.getItem("studyflow-sessions") || "[]");
        localStorage.setItem(
          "studyflow-sessions",
          JSON.stringify([
            ...existingSessions,
            {
              date: new Date(),
              duration: roomTime,
              mode: "room",
              roomId,
            },
          ])
        );
      }
    };
  }, [roomId, navigate]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const newTaskObj: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
    
    // In a real app, we would update the task list on the server
    const rooms = JSON.parse(localStorage.getItem("studyflow-rooms") || "[]");
    const updatedRooms = rooms.map((r: any) => {
      if (r.id === roomId) {
        return { ...r, tasks: [...(r.tasks || []), newTaskObj] };
      }
      return r;
    });
    
    localStorage.setItem("studyflow-rooms", JSON.stringify(updatedRooms));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
    const userName = userData.name || "Anonymous";
    const userInitials = userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: userName,
      senderInitials: userInitials,
      text: newMessage,
      timestamp: new Date(),
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">Loading study room...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-2 p-0 h-9 w-9"
          onClick={() => navigate("/rooms")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <div className="flex space-x-2 mt-1">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.participants} studying
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.floor(roomTime / 60)}m
            </Badge>
          </div>
        </div>
        <Button 
          className="bg-studyflow-primary hover:bg-studyflow-accent"
          onClick={() => navigate(`/timer?from=room&roomId=${roomId}`)}
        >
          Start Focus Timer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Study Tasks</CardTitle>
              <CardDescription>Shared tasks for this session</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="flex space-x-2 mb-4">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  className="bg-studyflow-primary hover:bg-studyflow-accent"
                  disabled={!newTask.trim()}
                >
                  Add
                </Button>
              </form>
              
              <TaskList tasks={tasks} onToggle={handleToggleTask} />
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Section */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Group Chat</CardTitle>
              <CardDescription>Discuss with your study partners</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={message.sender === "System" ? "bg-gray-500" : "bg-studyflow-primary"}>
                        {message.senderInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-sm">{message.sender}</p>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="mt-auto flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  className="bg-studyflow-primary hover:bg-studyflow-accent"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyRoomDetail;
