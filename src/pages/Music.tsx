import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Music, User, Settings, LogOut, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: string;
  isFavorite: boolean;
}

export default function MusicPage() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'favorites'>('all');
  const [songs, setSongs] = useState<Song[]>([
    { id: '1', title: 'Wonderwall', artist: 'Oasis', difficulty: 'Beginner', isFavorite: false },
    { id: '2', title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', difficulty: 'Intermediate', isFavorite: false },
    { id: '3', title: 'Nothing Else Matters', artist: 'Metallica', difficulty: 'Advanced', isFavorite: false },
    { id: '4', title: 'Hey Jude', artist: 'The Beatles', difficulty: 'Beginner', isFavorite: false },
  ]);

  const toggleFavorite = (songId: string) => {
    setSongs(songs.map(song => 
      song.id === songId ? { ...song, isFavorite: !song.isFavorite } : song
    ));
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Add logout logic here
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
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
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
      <div className="pt-20 flex min-h-screen">
        {/* Left Navigation */}
        <div className="w-64 bg-gray-900 border-r border-orange-900/20 p-6 fixed h-full">
          <nav className="space-y-4">
            <button
              onClick={() => setSelectedTab('all')}
              className={cn(
                "w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedTab === 'all' 
                  ? "bg-orange-500/20 text-orange-400" 
                  : "text-gray-300 hover:bg-orange-500/10 hover:text-orange-400"
              )}
            >
              <Music className="w-4 h-4 mr-2" />
              All Songs
            </button>
            <button
              onClick={() => setSelectedTab('favorites')}
              className={cn(
                "w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedTab === 'favorites'
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-orange-500/10 hover:text-orange-400"
              )}
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </button>
          </nav>
        </div>

        {/* Song List */}
        <div className="flex-1 pl-64">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">
              {selectedTab === 'all' ? 'All Songs' : 'Favorite Songs'}
            </h1>
            <div className="grid gap-4">
              {songs
                .filter(song => selectedTab === 'all' || song.isFavorite)
                .map(song => (
                  <div
                    key={song.id}
                    className="bg-gray-900 rounded-lg p-4 flex items-center justify-between border border-orange-900/20 hover:border-orange-500/40 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">{song.title}</h3>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                      <span className="inline-block px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs mt-2">
                        {song.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(song.id)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        song.isFavorite
                          ? "text-orange-400 bg-orange-500/20"
                          : "text-gray-400 hover:text-orange-400 hover:bg-orange-500/10"
                      )}
                    >
                      <Star className="w-5 h-5" fill={song.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 