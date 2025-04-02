
import { useParams } from "react-router-dom";
import StudyRoomDetailComponent from "@/components/rooms/StudyRoomDetail";

const StudyRoomDetailPage = () => {
  const { roomId } = useParams();
  
  if (!roomId) {
    return <div>Room ID not provided</div>;
  }
  
  return <StudyRoomDetailComponent roomId={roomId} />;
};

export default StudyRoomDetailPage;
