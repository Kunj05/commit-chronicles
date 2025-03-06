
import React, { useState } from 'react';
import { Commit } from '../types';
import { GitCommit, Clock, File, User, Calendar, Search, ToggleLeft, ToggleRight, BarChart, Table } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { CommitChart } from './CommitChart';

interface CommitTableProps {
  commits: Commit[];
  loading: boolean;
  error: string | null;
}

const CommitTable: React.FC<CommitTableProps> = ({ commits, loading, error }) => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [searchByMessage, setSearchByMessage] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // Get unique authors for dropdown
  const authors = Array.from(new Set(commits.map(commit => commit.commit.author.name)));

  // Handle search button click
  const handleSearch = () => {
    // In a real app, this would fetch from GitHub API
    console.log("Searching repository:", repoUrl);
  };

  // Loading state with glass-morphism effect
  if (loading) {
    return (
      <div className="rounded-xl glass-morphism overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="table-shine space-y-2" style={{ animationDelay: `${0.1 * index}s` }}>
              <div className="h-6 bg-white/5 rounded w-3/4"></div>
              <div className="h-4 bg-white/5 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state with glass-morphism styling
  if (error) {
    return (
      <div className="rounded-xl glass-morphism overflow-hidden p-8 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // Empty state with glass-morphism styling
  if (!commits.length) {
    return (
      <div className="rounded-xl glass-morphism overflow-hidden p-8 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <p className="text-muted-foreground">No commits found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* GitHub Repository Input */}
      <div className="glass-morphism rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">GitHub Repository</h2>
        <div className="flex space-x-2">
          <Input 
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter GitHub repository URL (e.g. github.com/user/repo)"
            className="bg-white/5 border-white/10"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      
      {/* View Toggle and Filters */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-1"
            >
              <Table className="h-4 w-4" />
              Table
            </Button>
            <Button 
              variant={viewMode === 'chart' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('chart')}
              className="flex items-center gap-1"
            >
              <BarChart className="h-4 w-4" />
              Chart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Author Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Filter by Author</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedAuthor || "Select Author"}
                  <User className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] bg-background/95 backdrop-blur-sm border-white/10">
                <DropdownMenuItem onClick={() => setSelectedAuthor('')}>
                  All Authors
                </DropdownMenuItem>
                {authors.map(author => (
                  <DropdownMenuItem key={author} onClick={() => setSelectedAuthor(author)}>
                    {author}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Search Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Search By</label>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSearchByMessage(!searchByMessage)}
            >
              {searchByMessage ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Commit Message
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  File Name
                </>
              )}
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Search {searchByMessage ? "Commit Messages" : "File Names"}
            </label>
            <div className="flex">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search by ${searchByMessage ? "commit message" : "file name"}`}
                className="bg-white/5 border-white/10 w-full"
              />
              <Button variant="ghost" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Date Range Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-white/10" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-white/10" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-xl glass-morphism animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-6 text-left font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <GitCommit className="h-4 w-4" />
                      <span>Commit Message</span>
                    </div>
                  </th>
                  <th className="p-6 text-left font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="p-6 text-left font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Time</span>
                    </div>
                  </th>
                  <th className="p-6 text-left font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4" />
                      <span>Changed Files</span>
                    </div>
                  </th>
                  <th className="p-6 text-left font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Author</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {commits.map((commit, index) => {
                  const dateTime = new Date(commit.commit.author.date);
                  const formattedDate = dateTime.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const formattedTime = dateTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });

                  return (
                    <tr 
                      key={commit.sha}
                      className="group hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-0"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <td className="p-6">
                        <div className="font-medium group-hover:text-blue-400 transition-colors">
                          {commit.commit.message}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium">
                          {formattedDate}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium">
                          {formattedTime}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1.5">
                          {(commit.files || []).map((file, fileIndex) => (
                            <div 
                              key={fileIndex} 
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400"
                            >
                              {file.filename}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium">
                          {commit.commit.author.name}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-morphism rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CommitChart commits={commits} />
        </div>
      )}
    </div>
  );
};

export default CommitTable;
