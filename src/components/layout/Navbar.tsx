
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, BarChart2, Users, Settings } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = () => {
    return "SF";
  };

  const getUserName = () => {
    return "Student";
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-studyflow-primary">StudyFlow</span>
          </Link>
          
          <nav className="ml-8 hidden md:flex items-center space-x-1">
            <Link to="/dashboard">
              <Button
                variant={location.pathname === "/dashboard" ? "default" : "ghost"}
                className={
                  location.pathname === "/dashboard"
                    ? "bg-studyflow-primary hover:bg-studyflow-accent"
                    : ""
                }
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/timer">
              <Button
                variant={location.pathname === "/timer" ? "default" : "ghost"}
                className={
                  location.pathname === "/timer"
                    ? "bg-studyflow-primary hover:bg-studyflow-accent"
                    : ""
                }
                size="sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Timer
              </Button>
            </Link>
            <Link to="/rooms">
              <Button
                variant={location.pathname === "/rooms" ? "default" : "ghost"}
                className={
                  location.pathname === "/rooms"
                    ? "bg-studyflow-primary hover:bg-studyflow-accent"
                    : ""
                }
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Study Rooms
              </Button>
            </Link>
            <Link to="/stats">
              <Button
                variant={location.pathname === "/stats" ? "default" : "ghost"}
                className={
                  location.pathname === "/stats"
                    ? "bg-studyflow-primary hover:bg-studyflow-accent"
                    : ""
                }
                size="sm"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Stats
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-studyflow-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserName()}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
