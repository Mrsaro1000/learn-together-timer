
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dailyGoal, setDailyGoal] = useState(120);
  const [focusTime, setFocusTime] = useState("25");
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studyflow-user") || "{}");
    setUser(userData);
    
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setDailyGoal(userData.dailyGoal || 120);
      setFocusTime(userData.focusTime ? userData.focusTime.toString() : "25");
      setNotifications(userData.notifications !== false);
      setPublicProfile(userData.publicProfile !== false);
    }
  }, []);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name,
        email,
        dailyGoal,
        focusTime: parseInt(focusTime),
        notifications,
        publicProfile,
      };
      
      localStorage.setItem("studyflow-user", JSON.stringify(updatedUser));
      toast.success("Settings saved successfully!");
      setIsLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Study Preferences</CardTitle>
          <CardDescription>
            Customize your study experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>
              Daily study goal: {dailyGoal} minutes
            </Label>
            <Slider
              value={[dailyGoal]}
              min={30}
              max={360}
              step={30}
              onValueChange={(value) => setDailyGoal(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30m</span>
              <span>2h</span>
              <span>4h</span>
              <span>6h</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="focus-time">Default focus session length</Label>
            <Select value={focusTime} onValueChange={setFocusTime}>
              <SelectTrigger id="focus-time">
                <SelectValue placeholder="Select session length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                <SelectItem value="50">50 minutes (Extended)</SelectItem>
                <SelectItem value="90">90 minutes (Deep work)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your study sessions
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to other users
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={publicProfile}
              onCheckedChange={setPublicProfile}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          className="bg-studyflow-primary hover:bg-studyflow-accent"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
