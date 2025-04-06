import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Music, User, Settings as SettingsIcon, LogOut, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SettingsState {
  strokeColor: string;
  textColor: string;
  speed: number;
}

export default function Settings() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>({
    strokeColor: "#ff6b00",
    textColor: "#ffffff",
    speed: 1.0
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token'); // Remove auth token
    navigate('/'); // Navigate to home page
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const updateStrokeColor = async (color: string) => {
    try {
      await fetch('/api/v1/users/updateStrokeColor', {
        method: 'POST',
        body: JSON.stringify({ strokeColor: color }),
      });
      setSettings(prev => ({ ...prev, strokeColor: color }));
      toast({
        title: "Success",
        description: "Stroke color updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stroke color",
        variant: "destructive",
      });
    }
  };

  const updateTextColor = async (color: string) => {
    try {
      await fetch('/api/v1/users/updateTextColor', {
        method: 'POST',
        body: JSON.stringify({ textColor: color }),
      });
      setSettings(prev => ({ ...prev, textColor: color }));
      toast({
        title: "Success",
        description: "Text color updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update text color",
        variant: "destructive",
      });
    }
  };

  const updateSpeed = async (speed: number) => {
    try {
      await fetch('/api/v1/users/updateSpeed', {
        method: 'POST',
        body: JSON.stringify({ speed }),
      });
      setSettings(prev => ({ ...prev, speed }));
      toast({
        title: "Success",
        description: "Playback speed updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update playback speed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3 px-6 md:px-10",
        "bg-gray-900/70 header-blur border-b border-orange-900/30 shadow-lg shadow-orange-500/5"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-medium mr-2 text-orange-500">
              ARiff
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/auth-home" className="nav-link flex items-center text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/music" className="nav-link flex items-center text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors">
              <Music className="w-4 h-4 mr-1" />
              <span>Music</span>
            </Link>
          </nav>
          
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="w-10 h-10 rounded-full bg-orange-500/10 hover:bg-orange-500/20 flex items-center justify-center transition-colors"
            >
              <User className="w-5 h-5 text-orange-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link
                    to="/profile"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    role="menuitem"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Customize your AR guitar learning experience</p>
          </div>

          <div className="space-y-8">
            {/* AR Stroke Color */}
            <div className="bg-gray-900 rounded-lg p-6 border border-orange-900/20">
              <Label htmlFor="strokeColor" className="text-white mb-2 block">AR Stroke Color</Label>
              <div className="flex gap-4">
                <Input
                  type="color"
                  id="strokeColor"
                  value={settings.strokeColor}
                  onChange={(e) => updateStrokeColor(e.target.value)}
                  className="w-20 h-10 bg-transparent border-orange-500/20"
                />
                <Input
                  type="text"
                  value={settings.strokeColor}
                  onChange={(e) => updateStrokeColor(e.target.value)}
                  className="flex-1"
                  placeholder="#ff6b00"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Choose the color for AR guitar chord projections</p>
            </div>

            {/* Text Color */}
            <div className="bg-gray-900 rounded-lg p-6 border border-orange-900/20">
              <Label htmlFor="textColor" className="text-white mb-2 block">AR Text Color</Label>
              <div className="flex gap-4">
                <Input
                  type="color"
                  id="textColor"
                  value={settings.textColor}
                  onChange={(e) => updateTextColor(e.target.value)}
                  className="w-20 h-10 bg-transparent border-orange-500/20"
                />
                <Input
                  type="text"
                  value={settings.textColor}
                  onChange={(e) => updateTextColor(e.target.value)}
                  className="flex-1"
                  placeholder="#ffffff"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Choose the color for AR text overlays</p>
            </div>

            {/* Playback Speed */}
            <div className="bg-gray-900 rounded-lg p-6 border border-orange-900/20">
              <Label htmlFor="speed" className="text-white mb-4 block">Playback Speed</Label>
              <Slider
                id="speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.speed]}
                onValueChange={(value) => updateSpeed(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>0.5x</span>
                <span>Current: {settings.speed}x</span>
                <span>2x</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">Adjust the playback speed of guitar lessons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 