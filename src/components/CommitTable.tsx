
import React from 'react';
import { Commit } from '../types';
import { GitCommit, Clock, File, User } from 'lucide-react';

interface CommitTableProps {
  commits: Commit[];
  loading: boolean;
  error: string | null;
}

const CommitTable: React.FC<CommitTableProps> = ({ commits, loading, error }) => {
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

  // Render commits with glass-morphism styling
  return (
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
                  <Clock className="h-4 w-4" />
                  <span>Date & Time</span>
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
                    <div className="text-xs text-muted-foreground mt-1">
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
  );
};

export default CommitTable;
