
import React from 'react';
import { GitBranch } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full animate-fade-in">
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
