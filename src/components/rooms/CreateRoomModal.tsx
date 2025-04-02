
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateRoomModal = () => {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    // Get current user data (or create anonymous user)
    const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
    
    // If no user exists, create an anonymous one
    if (!userData.id) {
      userData.id = "user-" + Date.now();
      userData.name = userData.name || "Anonymous";
      localStorage.setItem("studyflow-user", JSON.stringify(userData));
    }

    const newRoom = {
      id: Date.now().toString(),
      name: roomName,
      participants: 1,
      maxParticipants,
      isPrivate,
      subject: subject || "General",
      activeTime: 0,
      creatorId: userData.id,
      createdAt: new Date().toISOString(),
    };

    // Get existing rooms
    const existingRooms = JSON.parse(localStorage.getItem("studyflow-rooms") || "[]");
    
    // Add new room
    localStorage.setItem("studyflow-rooms", JSON.stringify([...existingRooms, newRoom]));
    
    // Initialize empty task and chat arrays for this room
    localStorage.setItem(`studyflow-tasks-${newRoom.id}`, JSON.stringify([]));
    localStorage.setItem(`studyflow-chat-${newRoom.id}`, JSON.stringify([]));
    
    setOpen(false);
    toast.success("Study room created");
    
    // Navigate to the new room
    navigate(`/rooms/${newRoom.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-studyflow-primary hover:bg-studyflow-accent">
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Study Room</DialogTitle>
          <DialogDescription>
            Set up a virtual space for studying with others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="E.g., Math Study Group"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject (Optional)</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.g., Calculus, Physics, etc."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxParticipants">Maximum Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              max="20"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private">Private Room</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-studyflow-primary hover:bg-studyflow-accent"
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
