import React from 'react';
import { GitBranch } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip"; // Assuming you have a Tooltip component in your UI library

const Header: React.FC = () => {
  return (
    <header className="w-full animate-fade-in relative">
      {/* Sticky points with tooltips, always visible in the top-right corner */}
      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-10">
      
        <div className="fixed top-4 right-4 bg-red-600 text-white p-3 rounded-md shadow-lg z-50 max-w-xs">
          <p className="text-sm font-semibold">Use small repo having less commits or branches .</p>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 p-3">
            <GitBranch className="h-8 w-8 text-blue-500" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Commit Chronicles
            </h1>
            <p className="max-w-md mx-auto text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              A beautiful timeline of your repository's history
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
