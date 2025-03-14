import React, { useState } from 'react';
import { GitBranch, Github, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const HomeNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="z-40 w-full backdrop-blur-md bg-background/50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <GitBranch className="w-8 h-8 mr-2 text-blue-500" />
              <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                CommitChronicles
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/explore" className="text-gray-300 hover:text-white transition-colors">
              Analysis
            </a>
            <a href="/components" className="text-gray-300 hover:text-white transition-colors">
              Components
            </a>
            <a href="https://github.com/your-repo-here" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/20">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-md border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              
              <a 
                href="/explore" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </a>
              <a 
                href="/components" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Components
              </a>
              <div className="pt-2">
                <a 
                  href="https://github.com/your-repo-here" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full border-white/20">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default  HomeNav;