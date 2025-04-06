import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Home, Music, LogIn, Info, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-10",
        scrolled ? "bg-gray-900/70 header-blur border-b border-orange-900/30 shadow-lg shadow-orange-500/5" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-medium mr-2 text-orange-500">
            ARiff
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link flex items-center text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
          <Link to="/signup" className="nav-link flex items-center text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors">
            <Music className="w-4 h-4 mr-1" />
            <span>Music</span>
          </Link>
          <a 
            href="#about" 
            onClick={scrollToAbout}
            className="nav-link flex items-center text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
          >
            <Info className="w-4 h-4 mr-1" />
            <span>About Us</span>
          </a>
        </nav>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full border-orange-500 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-300"
            asChild
          >
            <Link to="/login">
              <LogIn className="w-4 h-4 mr-1" />
              <span>Login</span>
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
            asChild
          >
            <Link to="/signup">
              <UserPlus className="w-4 h-4 mr-1" />
              <span>Sign Up</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
