
import React from 'react';
import { GitBranch } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full animate-fade-in relative">
      {/* Warning notification */}
      <div className="fixed top-4 right-4 bg-gradient-to-r from-red-600/90 to-red-600/70 text-white p-3.5 rounded-xl shadow-lg z-50 max-w-xs backdrop-blur-sm border border-white/10 animate-fade-in-up">
        <p className="text-sm font-medium">Use small repos with fewer commits or branches.</p>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-600/10 p-5 border border-blue-500/20 shadow-inner">
            <GitBranch className="h-10 w-10 text-blue-500" />
          </div>
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70" style={{ animationDelay: '0.1s' }}>
              Commit Chronicles
            </h1>
            <p className="max-w-md mx-auto text-muted-foreground animate-fade-in-up text-lg" style={{ animationDelay: '0.2s' }}>
              A beautiful timeline of your repository's history
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;