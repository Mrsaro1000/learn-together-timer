
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from "lucide-react";
import Peer from "simple-peer";
import { toast } from "sonner";

interface VideoCallComponentProps {
  roomId: string;
  username: string;
  isPrivate: boolean;
}

type PeerConnection = {
  peerId: string;
  peer: Peer.Instance;
  username: string;
  stream?: MediaStream;
};

const VideoCallComponent: React.FC<VideoCallComponentProps> = ({
  roomId,
  username,
  isPrivate,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const roomPrefix = isPrivate ? `private-${roomId}` : `public-${roomId}`;

  // Initialize local stream
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Could not access camera or microphone");
      return null;
    }
  };

  // Join the call
  const joinCall = async () => {
    const stream = await initializeMedia();
    if (!stream) return;
    
    setIsCallActive(true);
    
    // Broadcast that we've joined
    const joinMessage = {
      type: "join-call",
      roomId: roomPrefix,
      peerId: generatePeerId(),
      username,
    };
    
    // In a real app, we would send this through a signaling server
    // For demo purposes, we'll use localStorage as a mock signaling mechanism
    const existingSignals = JSON.parse(localStorage.getItem(`studyflow-signals-${roomPrefix}`) || "[]");
    localStorage.setItem(`studyflow-signals-${roomPrefix}`, JSON.stringify([...existingSignals, joinMessage]));
    
    // Check if there are other peers to connect to
    const otherPeers = existingSignals.filter(
      (signal: any) => signal.type === "join-call" && signal.peerId !== joinMessage.peerId
    );
    
    // Connect to other peers
    otherPeers.forEach((peerData: any) => {
      const peer = createPeer(peerData.peerId, joinMessage.peerId, stream);
      
      peersRef.current.push({
        peerId: peerData.peerId,
        peer,
        username: peerData.username,
      });
    });
    
    setPeers(peersRef.current);
    
    // Simulate new peer joins (for demo)
    window.addEventListener("storage", (e) => {
      if (e.key === `studyflow-signals-${roomPrefix}`) {
        const signals = JSON.parse(e.newValue || "[]");
        const newSignals = signals.filter(
          (signal: any) => !existingSignals.some((s: any) => s.peerId === signal.peerId)
        );
        
        newSignals.forEach((signal: any) => {
          if (signal.type === "join-call" && signal.peerId !== joinMessage.peerId) {
            // Add new peer
            const peer = createPeer(signal.peerId, joinMessage.peerId, stream);
            peersRef.current.push({
              peerId: signal.peerId,
              peer,
              username: signal.username,
            });
            setPeers([...peersRef.current]);
          }
        });
      }
    });
  };

  // Leave the call
  const leaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    
    peers.forEach((peerConnection) => {
      peerConnection.peer.destroy();
    });
    
    setPeers([]);
    peersRef.current = [];
    setLocalStream(null);
    setIsCallActive(false);
    
    // Remove our signal
    const existingSignals = JSON.parse(localStorage.getItem(`studyflow-signals-${roomPrefix}`) || "[]");
    const updatedSignals = existingSignals.filter(
      (signal: any) => signal.peerId !== "our-peer-id" // Replace with actual peer ID
    );
    localStorage.setItem(`studyflow-signals-${roomPrefix}`, JSON.stringify(updatedSignals));
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Generate a unique peer ID
  const generatePeerId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Create a peer connection
  const createPeer = (targetPeerId: string, callerId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    
    peer.on("signal", (signal) => {
      // In a real app, we would send this through a signaling server
      const signalData = {
        type: "offer",
        callerId,
        targetPeerId,
        signal,
      };
      
      // For demo, use localStorage as a mock signaling mechanism
      const existingSignals = JSON.parse(localStorage.getItem(`studyflow-signals-${roomPrefix}`) || "[]");
      localStorage.setItem(`studyflow-signals-${roomPrefix}`, JSON.stringify([...existingSignals, signalData]));
    });
    
    peer.on("stream", (peerStream) => {
      const peerIndex = peersRef.current.findIndex((p) => p.peerId === targetPeerId);
      if (peerIndex !== -1) {
        const updatedPeers = [...peersRef.current];
        updatedPeers[peerIndex].stream = peerStream;
        peersRef.current = updatedPeers;
        setPeers(updatedPeers);
      }
    });
    
    return peer;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      peers.forEach((peerConnection) => {
        peerConnection.peer.destroy();
      });
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isCallActive && (
          <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
              You (Host)
            </div>
          </div>
        )}
        
        {peers.map((peer) => (
          <div key={peer.peerId} className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video">
            {peer.stream ? (
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                srcObject={peer.stream}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Connecting...
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
              {peer.username}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {!isCallActive ? (
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={joinCall}
          >
            <Phone className="h-4 w-4 mr-2" />
            Join Call
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={toggleAudio}
              className={!isAudioEnabled ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              {isAudioEnabled ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={toggleVideo}
              className={!isVideoEnabled ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              {isVideoEnabled ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="destructive"
              onClick={leaveCall}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Leave Call
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallComponent;
