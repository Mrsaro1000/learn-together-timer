
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from "lucide-react";
import { toast } from "sonner";

interface VideoCallComponentProps {
  roomId: string;
  username: string;
  isPrivate: boolean;
}

type PeerConnection = {
  peerId: string;
  connection: RTCPeerConnection;
  username: string;
  stream?: MediaStream;
};

// Generate a unique peer ID helper function
const generatePeerId = () => {
  return Math.random().toString(36).substring(2, 15);
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
  const myPeerId = useRef<string>(generatePeerId());

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
      peerId: myPeerId.current,
      username,
    };
    
    // For demo purposes, we'll use localStorage as a mock signaling mechanism
    const existingSignals = JSON.parse(localStorage.getItem(`studyflow-signals-${roomPrefix}`) || "[]");
    localStorage.setItem(`studyflow-signals-${roomPrefix}`, JSON.stringify([...existingSignals, joinMessage]));
    
    // Check if there are other peers to connect to
    const otherPeers = existingSignals.filter(
      (signal: any) => signal.type === "join-call" && signal.peerId !== myPeerId.current
    );
    
    // Connect to other peers
    otherPeers.forEach((peerData: any) => {
      createPeerConnection(peerData.peerId, true, stream, peerData.username);
    });
    
    // Listen for new signals
    window.addEventListener("storage", handleStorageChange);
  };

  // Handle localStorage storage events (for signaling)
  const handleStorageChange = (e: StorageEvent) => {
    if (!e.key || !e.key.startsWith(`studyflow-signals-${roomPrefix}`)) return;
    if (!localStream) return;

    const signals = JSON.parse(e.newValue || "[]");
    signals.forEach((signal: any) => {
      if (signal.peerId === myPeerId.current) return; // Skip our own signals

      // Handle new peer joining
      if (signal.type === "join-call" && !peersRef.current.some(p => p.peerId === signal.peerId)) {
        createPeerConnection(signal.peerId, false, localStream, signal.username);
      }
      
      // Handle offers
      else if (signal.type === "offer" && signal.targetPeerId === myPeerId.current) {
        handleIncomingOffer(signal.callerId, signal.sdp, signal.username);
      }
      
      // Handle answers
      else if (signal.type === "answer" && signal.targetPeerId === myPeerId.current) {
        handleAnswer(signal.callerId, signal.sdp);
      }
      
      // Handle ICE candidates
      else if (signal.type === "ice-candidate" && signal.targetPeerId === myPeerId.current) {
        handleNewICECandidate(signal.callerId, signal.candidate);
      }
    });
  };

  // Create a new peer connection
  const createPeerConnection = (peerId: string, isInitiator: boolean, stream: MediaStream, peerUsername: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.stunprotocol.org:3478" },
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // Add all tracks from our stream to the connection
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const peerIndex = peersRef.current.findIndex((p) => p.peerId === peerId);
      
      if (peerIndex !== -1) {
        const updatedPeers = [...peersRef.current];
        updatedPeers[peerIndex].stream = remoteStream;
        peersRef.current = updatedPeers;
        setPeers([...updatedPeers]);
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the remote peer
        const iceMessage = {
          type: "ice-candidate",
          callerId: myPeerId.current,
          targetPeerId: peerId,
          candidate: event.candidate,
        };
        
        sendSignal(iceMessage);
      }
    };

    // Create and store the peer
    const newPeer = {
      peerId,
      connection: peerConnection,
      username: peerUsername,
    };
    
    peersRef.current = [...peersRef.current, newPeer];
    setPeers([...peersRef.current]);

    // If we're the initiator, create and send the offer
    if (isInitiator) {
      peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
          const offerMessage = {
            type: "offer",
            callerId: myPeerId.current,
            targetPeerId: peerId,
            sdp: peerConnection.localDescription,
            username,
          };
          
          sendSignal(offerMessage);
        })
        .catch(error => {
          console.error("Error creating offer:", error);
          toast.error("Error connecting to peer");
        });
    }

    return peerConnection;
  };

  // Handle incoming offer
  const handleIncomingOffer = (callerId: string, sdp: RTCSessionDescriptionInit, peerUsername: string) => {
    if (!localStream) return;

    // Find existing peer or create a new one
    let peerConnection = peersRef.current.find(p => p.peerId === callerId)?.connection;
    
    if (!peerConnection) {
      peerConnection = createPeerConnection(callerId, false, localStream, peerUsername).connection;
    }

    // Set the remote description from the offer
    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => peerConnection.createAnswer())
      .then(answer => peerConnection.setLocalDescription(answer))
      .then(() => {
        // Send the answer back
        const answerMessage = {
          type: "answer",
          callerId: myPeerId.current,
          targetPeerId: callerId,
          sdp: peerConnection.localDescription,
        };
        
        sendSignal(answerMessage);
      })
      .catch(error => {
        console.error("Error handling offer:", error);
        toast.error("Error connecting to peer");
      });
  };

  // Handle incoming answer
  const handleAnswer = (callerId: string, sdp: RTCSessionDescriptionInit) => {
    const peer = peersRef.current.find(p => p.peerId === callerId);
    
    if (peer && peer.connection) {
      peer.connection.setRemoteDescription(new RTCSessionDescription(sdp))
        .catch(error => {
          console.error("Error setting remote description:", error);
        });
    }
  };

  // Handle new ICE candidate
  const handleNewICECandidate = (callerId: string, candidate: RTCIceCandidateInit) => {
    const peer = peersRef.current.find(p => p.peerId === callerId);
    
    if (peer && peer.connection) {
      peer.connection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => {
          console.error("Error adding ICE candidate:", error);
        });
    }
  };

  // Send a signal through localStorage (mock signaling server)
  const sendSignal = (signal: any) => {
    const signals = JSON.parse(localStorage.getItem(`studyflow-signals-${roomPrefix}`) || "[]");
    localStorage.setItem(`studyflow-signals-${roomPrefix}`, JSON.stringify([...signals, signal]));
  };

  // Leave the call
  const leaveCall = () => {
    // Remove event listener
    window.removeEventListener("storage", handleStorageChange);
    
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    
    // Close all peer connections
    peers.forEach((peerConnection) => {
      peerConnection.connection.close();
    });
    
    // Clear state
    setPeers([]);
    peersRef.current = [];
    setLocalStream(null);
    setIsCallActive(false);
    
    // Remove our signals
    const existingSignals = JSON.parse(localStorage.getItem(`studyflow-signals-${roomPrefix}`) || "[]");
    const updatedSignals = existingSignals.filter(
      (signal: any) => signal.peerId !== myPeerId.current
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveCall();
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
              playsInline
              muted
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
              <PeerVideo stream={peer.stream} />
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

// Helper component to handle srcObject correctly
interface PeerVideoProps {
  stream: MediaStream;
}

const PeerVideo: React.FC<PeerVideoProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

export default VideoCallComponent;
