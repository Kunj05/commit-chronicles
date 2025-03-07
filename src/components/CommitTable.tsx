import React, { useState, useEffect } from 'react';
import { Commit } from '../types';
import { GitCommit, Clock, File, User, Calendar, Download, Search, BarChart, Table, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Switch } from './ui/switch';
import { CommitChart } from './CommitChart';
import { toast } from "sonner";
import { ForkList } from './ForkList'; 

interface CommitTableProps {
  commits: Commit[];
  loading: boolean;
  error: string | null;
  repoUrl: string;
}

const CommitTable: React.FC<CommitTableProps> = ({ commits , loading, error, repoUrl }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [searchByMessage, setSearchByMessage] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'chart' | 'Contributor List'>('table');
  const [selectedBranch, setSelectedBranch] = useState<string>('main'); 


  // Derive branches from commits
  const branches = [...new Set(commits.map((commit) => commit.branch).filter(Boolean))] as string[];

  // Filter commits based on search and other filters
  const filteredCommits = commits
    .filter((commit) => {
      const dateTime = new Date(commit.commit.author.date);
      const authorMatch = !selectedAuthor || commit.commit.author.name === selectedAuthor;
      const startDateMatch = !startDate || dateTime >= startDate;
      const endDateMatch = !endDate || dateTime <= endDate;
      const searchMatch =
        !searchQuery ||
        (searchByMessage
          ? commit.commit.message.toLowerCase().includes(searchQuery.toLowerCase())
          : (commit.files || []).some((file) =>
              file.filename.toLowerCase().includes(searchQuery.toLowerCase())
            ));
      const branchMatch = !selectedBranch || commit.branch === selectedBranch;
      return authorMatch && startDateMatch && endDateMatch && searchMatch && branchMatch;
    })
    .sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime());

  // Loading state with glass-morphism effect
  if (loading && commits.length > 0) {
    return (
      <div className="rounded-xl mt-6 glass-morphism overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
      <div className="mt-8 rounded-xl glass-morphism overflow-hidden p-8 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const authors = Array.from(new Set(
    commits
      .map((commit) => commit.author?.login) // Extract author login
      .filter((author) => author !== undefined) // Filter out undefined values
  ));    

  const handleExportCsv = () => {
    const csv = [
      ['Commit', 'Date', 'Time', 'Files Changed', 'Author', 'Branch'].join(','),
      ...filteredCommits.map((commit) => {
        const dateTime = new Date(commit.commit.author.date);
        return [
          `"${commit.commit.message.replace(/"/g, '""')}"`,
          dateTime.toLocaleDateString(),
          dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          `"${(commit.files || []).map((f) => f.filename).join(', ')}"`,
          commit.commit.author.name,
          commit.branch || 'unknown',
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'commits_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast('File Downloaded Successfully');
  };

  return (
    <div className="space-y-6 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      
      {commits.length > 0 && (
        <>
          {/* View Toggle and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-1"
              >
                <Table className="h-8 w-9" />
                Table
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setViewMode('chart')}
                className="flex items-center gap-1"
              >
                <BarChart className="h-4 w-4" />
                Chart
              </Button>
              <Button
                variant={viewMode === 'Contributor List' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setViewMode('Contributor List')}
                className="flex items-center gap-1"
              >
                <BarChart className="h-4 w-4" />
                Contributor List
              </Button>

            </div>
          </div>

          {/* Conditional Rendering based on viewMode */}
          {viewMode === 'table' && (
            <div>
              {/* Filters */}
              <div className="glass-morphism rounded-xl p-6 mb-9">
                <h2 className="text-2xl font-semibold mb-2">Filters</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                  {/* Branch Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Filter by Branch</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {selectedBranch || "Select Branch"}
                          <GitCommit className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[200px] bg-background/95 backdrop-blur-sm border-white/10">
                        {branches.map(branch => (
                          <DropdownMenuItem key={branch} onClick={() => setSelectedBranch(branch)}>
                            {branch}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Start Date Range Pickers */}
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
                          {startDate ? format(startDate, "PPP") : <span>Pick a Start date</span>}
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

                  {/* End Date Range Pickers */}
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
                          {endDate ? format(endDate, "PPP") : <span>Pick a End date</span>}
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

                <div className="flex justify-center items-center mt-4">
                  <div className="rounded-lg shadow-lg p-4 w-full max-w-6xl">
                    <div className="flex items-center gap-6">
                      {/* Search Toggle */}
                      <div className="space-y-2 pt-6">
                        <label className="text-sm font-medium text-muted-foreground mr-2">Search By</label>
                        <Switch
                          className=""
                          onClick={() => setSearchByMessage(!searchByMessage)}
                        />
                      </div>

                      {/* Search Input */}
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-muted-foreground">
                          Search {searchByMessage ? "Commit Messages" : "File Names"}
                        </label>
                        <div className="relative mb-6">
                          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search by ${searchByMessage ? "commit message" : "file name"}`}
                            className="bg-background/95 border-white/10 w-full pl-10"
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-4 pt-7">
                        <Button onClick={handleExportCsv}>
                          <Download className="h-4 w-4" /> Export CSV
                        </Button>
                        <Button onClick={() => {
                          const embedCode = `<iframe src="https://commit-chronicles-sigma.vercel.app/embed?repo=${repoUrl}" width="100%" height="400" frameborder="0"></iframe>`;
                          navigator.clipboard.writeText(embedCode);
                          
                        }}>
                          <Code2 className="h-4 w-4" /> Embed Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
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
                        <th className="p-7 text-left font-medium text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Date</span>
                          </div>
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Time</span>
                          </div>
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
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
                      {filteredCommits.map((commit, index) => {
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
                            <td className="p-6 w-[15%]">
                              <div className="font-medium">{formattedDate}</div>
                            </td>
                            <td className=" w-[15%]">
                              <div className="font-medium">{formattedTime}</div>
                            </td>
                            <td className="p-1 w-[35%]">
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
                              <div className="font-medium">{commit.commit.author.name}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {viewMode==='chart'&&(
             <div className="glass-morphism rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CommitChart commits={filteredCommits} />
            </div>
          )}
          {viewMode==='Contributor List'&&(
              <div className="glass-morphism rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <ForkList 
                commits={commits} 
                repoUrl={repoUrl}
                />
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommitTable;
