
import { useParams } from "react-router-dom";
import StudyRoomDetail from "@/components/rooms/StudyRoomDetail";

const StudyRoomDetailPage = () => {
  const { roomId } = useParams();
  
  if (!roomId) {
    return <div>Room ID not provided</div>;
  }
  
  return <StudyRoomDetail />;
};

export default StudyRoomDetailPage;
