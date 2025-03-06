
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="relative glass-morphism rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search commits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
