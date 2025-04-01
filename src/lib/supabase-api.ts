
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Study Sessions API
export async function saveStudySession(sessionData: {
  mode: string;
  duration: number;
  started_at?: string;
  completed_at?: string;
}) {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: user.data.user.id,
      ...sessionData
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error saving study session:", error);
    throw error;
  }
  
  return data;
}

export async function getUserSessions() {
  const { data, error } = await supabase
    .from('study_sessions')
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching study sessions:", error);
    throw error;
  }
  
  return data || [];
}

// User Preferences API
export async function saveUserPreferences(preferences: {
  daily_goal?: number;
  focus_time?: number;
}) {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }
  
  const { data: existingPrefs } = await supabase
    .from('user_preferences')
    .select("*")
    .eq("user_id", user.data.user.id)
    .maybeSingle();
  
  if (existingPrefs) {
    // Update existing preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.data.user.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
    
    return data;
  } else {
    // Insert new preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: user.data.user.id,
        ...preferences
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving user preferences:", error);
      throw error;
    }
    
    return data;
  }
}

export async function getUserPreferences() {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select("*")
    .eq("user_id", user.data.user.id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching user preferences:", error);
    throw error;
  }
  
  return data;
}
