
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <h1 className="text-4xl font-bold mb-4 text-studyflow-primary">
        Welcome to StudyFlow
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Track your study time, collaborate with others, and reach your learning goals
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="bg-studyflow-primary hover:bg-studyflow-accent"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
      </div>
    </div>
  );
};

export default Index;
