
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CreateRoomModalProps {
  onRoomCreated?: (roomId: string) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onRoomCreated }) => {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState("4");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Create a room object with a unique ID
    const roomId = Date.now().toString();
    const newRoom = {
      id: roomId,
      name: roomName,
      description,
      subject,
      isPrivate,
      maxParticipants: parseInt(maxParticipants),
      participants: 1, // Just the creator initially
      createdAt: new Date(),
      activeTime: 0,
      tasks: [],
    };

    // In a real app, we would send this to a backend
    // For now, store in localStorage as a demo
    setTimeout(() => {
      const existingRooms = JSON.parse(localStorage.getItem("studyflow-rooms") || "[]");
      localStorage.setItem("studyflow-rooms", JSON.stringify([...existingRooms, newRoom]));
      
      setIsLoading(false);
      setOpen(false);
      toast.success("Study room created successfully!");
      
      if (onRoomCreated) {
        onRoomCreated(roomId);
      } else {
        navigate(`/rooms/${roomId}`);
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-studyflow-primary hover:bg-studyflow-accent">
          <Plus className="h-4 w-4 mr-2" /> Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateRoom}>
          <DialogHeader>
            <DialogTitle>Create a Study Room</DialogTitle>
            <DialogDescription>
              Set up a new room for collaborative studying
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Exam Prep Group"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Math, Programming, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you be studying in this room?"
                className="resize-none"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="max-participants">Maximum Participants</Label>
              <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                <SelectTrigger id="max-participants">
                  <SelectValue placeholder="Select max participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="8">8 people</SelectItem>
                  <SelectItem value="12">12 people</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="private-room">Private Room</Label>
                <p className="text-sm text-muted-foreground">
                  Only people with the link can join
                </p>
              </div>
              <Switch
                id="private-room"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-studyflow-primary hover:bg-studyflow-accent"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
