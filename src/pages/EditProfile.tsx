import { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Music, User, Settings, LogOut, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UserData {
  fullName: string;
  email: string;
  bio: string;
  avatar: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // In a real app, this would come from your auth/user state
  const [userData, setUserData] = useState<UserData>({
    fullName: "John Doe",
    email: "john@example.com",
    bio: "Guitar enthusiast learning through AR technology",
    avatar: "/default-avatar.png"
  });

  const handleLogout = () => {
    // Add logout logic here
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, you would make an API call here to update the user data
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
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
            <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Avatar Upload */}
              <div className="mb-8">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-orange-500/20">
                    <img
                      src={userData.avatar}
                      alt={userData.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="bg-gray-800/50 border-gray-700 min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 