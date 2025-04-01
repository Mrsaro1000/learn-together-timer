
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import StudyRoomCard from "@/components/rooms/StudyRoomCard";
import CreateRoomModal from "@/components/rooms/CreateRoomModal";

const StudyRooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, fetch rooms from a backend
    // For demo, we'll use localStorage
    const savedRooms = JSON.parse(localStorage.getItem("studyflow-rooms") || "[]");
    
    // Add some sample rooms if none exist
    if (savedRooms.length === 0) {
      const demoRooms = [
        {
          id: "1",
          name: "Computer Science Study Group",
          participants: 3,
          maxParticipants: 4,
          isPrivate: false,
          subject: "Computer Science",
          activeTime: 45,
        },
        {
          id: "2",
          name: "Math Exam Prep",
          participants: 2,
          maxParticipants: 8,
          isPrivate: false,
          subject: "Mathematics",
          activeTime: 120,
        },
        {
          id: "3",
          name: "Language Learning",
          participants: 1,
          maxParticipants: 4,
          isPrivate: true,
          subject: "Languages",
          activeTime: 30,
        },
      ];
      
      localStorage.setItem("studyflow-rooms", JSON.stringify(demoRooms));
      setRooms(demoRooms);
    } else {
      setRooms(savedRooms);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would query the backend
    console.log(`Searching for: ${searchQuery}`);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.subject &&
        room.subject.toLowerCase().includes(searchQuery.toLowerCase()));
        
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "public") return !room.isPrivate && matchesSearch;
    if (activeTab === "private") return room.isPrivate && matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Study Rooms</h1>
        <CreateRoomModal />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <form onSubmit={handleSearch} className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rooms..."
              className="w-full pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <StudyRoomCard
            key={room.id}
            id={room.id}
            name={room.name}
            participants={room.participants}
            maxParticipants={room.maxParticipants}
            isPrivate={room.isPrivate}
            subject={room.subject}
            activeTime={room.activeTime}
          />
        ))}
        
        {filteredRooms.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No study rooms found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No rooms matching "${searchQuery}"`
                : "Try creating your own study room!"}
            </p>
            <CreateRoomModal />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyRooms;
