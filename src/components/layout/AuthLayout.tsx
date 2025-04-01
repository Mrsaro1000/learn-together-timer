
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Check if user is already logged in
  if (!loading && user && ["/", "/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-studyflow-secondary/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-studyflow-primary">
          StudyFlow
        </h1>
        {location.pathname === "/" && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Track your study time, join rooms, collaborate with others
          </p>
        )}
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
