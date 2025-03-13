
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitBranch, Menu, X } from "lucide-react";
import { useState } from "react";

const HomeNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full backdrop-blur-md bg-background/50 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
            <GitBranch className="h-5 w-5 text-blue-500" />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Commit Chronicles</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-sm hover:text-blue-400 transition-colors">
            Explorer
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/explore" className="hidden md:block">
            <Button variant="secondary" size="sm" className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 backdrop-blur-sm">
              Get Started
            </Button>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="p-2 rounded-md md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur-lg border-t border-white/10 animate-fade-in-up">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className="px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Explorer
            </Link>
            <Link 
              to="/explore" 
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="secondary" className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNav;
