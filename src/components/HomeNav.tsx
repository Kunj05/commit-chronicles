
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

const HomeNav: React.FC = () => {
  return (
    <nav className="w-full backdrop-blur-md bg-background/50 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <GitBranch className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-lg">Commit Chronicles</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-sm hover:text-blue-400 transition-colors">
            Explorer
          </Link>
        </div>
        
        <Link to="/explore">
          <Button variant="secondary" size="sm">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default HomeNav;
