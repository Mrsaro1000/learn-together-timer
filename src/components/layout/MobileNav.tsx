
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, BarChart2, Users, Home } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex flex-col items-center justify-center hover:bg-gray-50"
        >
          <Home
            className={`w-6 h-6 mb-1 ${
              isActive("/dashboard")
                ? "text-studyflow-primary"
                : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs ${
              isActive("/dashboard")
                ? "text-studyflow-primary font-medium"
                : "text-gray-500"
            }`}
          >
            Home
          </span>
        </Link>
        
        <Link
          to="/timer"
          className="inline-flex flex-col items-center justify-center hover:bg-gray-50"
        >
          <Clock
            className={`w-6 h-6 mb-1 ${
              isActive("/timer") ? "text-studyflow-primary" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs ${
              isActive("/timer")
                ? "text-studyflow-primary font-medium"
                : "text-gray-500"
            }`}
          >
            Timer
          </span>
        </Link>
        
        <Link
          to="/rooms"
          className="inline-flex flex-col items-center justify-center hover:bg-gray-50"
        >
          <Users
            className={`w-6 h-6 mb-1 ${
              isActive("/rooms") ? "text-studyflow-primary" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs ${
              isActive("/rooms")
                ? "text-studyflow-primary font-medium"
                : "text-gray-500"
            }`}
          >
            Rooms
          </span>
        </Link>
        
        <Link
          to="/stats"
          className="inline-flex flex-col items-center justify-center hover:bg-gray-50"
        >
          <BarChart2
            className={`w-6 h-6 mb-1 ${
              isActive("/stats") ? "text-studyflow-primary" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs ${
              isActive("/stats")
                ? "text-studyflow-primary font-medium"
                : "text-gray-500"
            }`}
          >
            Stats
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
