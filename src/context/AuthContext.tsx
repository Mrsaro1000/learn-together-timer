
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (username: string, password: string) => Promise<{
    error: AuthError | null;
    data: { session: Session | null };
  }>;
  signUp: (username: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    // Convert username to a fake email format for Supabase
    const email = `${username.toLowerCase()}@studyflow.local`;
    const response = await supabase.auth.signInWithPassword({ email, password });
    return {
      error: response.error,
      data: { session: response.data.session }
    };
  };

  const signUp = async (username: string, password: string) => {
    // Convert username to a fake email format for Supabase
    const email = `${username.toLowerCase()}@studyflow.local`;
    const response = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name: username
        }
      }
    });
    return {
      error: response.error,
      data: { 
        user: response.data.user,
        session: response.data.session
      }
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
