import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Music, User, Settings, LogOut, Edit, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserData {
  fullName: string;
  email: string;
  bio: string;
  avatar: string;
}

export default function UserProfile() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // In a real app, this would come from your auth/user state
  const [userData] = useState<UserData>({
    fullName: "Nina Dobrev",
    email: "dobrevnina@gmail.com",
    bio: "Guitar enthusiast learning through AR technology",
    avatar: "/default-avatar.png"
  });

  const handleLogout = () => {
    // Add logout logic here
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-10",
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
                    <Settings className="w-4 h-4 mr-2" />
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-8 border border-orange-900/20">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/20">
                  <img
                    src={userData.avatar}
                    alt={userData.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-white">{userData.fullName}</h1>
                  <Link to="/profile/edit">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                <p className="text-gray-400 mb-4">{userData.email}</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Bio</h3>
                  <p className="text-gray-400">{userData.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 