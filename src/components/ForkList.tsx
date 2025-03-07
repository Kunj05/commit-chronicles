import React, { useState } from "react";
import { Commit } from "../types/index";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { log } from "console";

// Define your CommitTableProps
interface CommitTableProps {
  commits: Commit[];
  repoUrl: string;
}

// Define a simplified Fork-like interface based on commits
interface CommitAuthorFork {
  authorName: string; // commit.commit.author.name
  login?: string;     // commit.author?.login (optional due to null possibility)
  commitCount: number;
  avatarUrl?: string; // Optional, default if unavailable
}

export const ForkList: React.FC<CommitTableProps> = ({ commits, repoUrl }) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>("");

  const authorForks: CommitAuthorFork[] = Array.from(
    new Map(
      commits.map((commit) => {
        const login = commit.author?.login || commit.commit.author.name || "Unknown"; // Use login, fallback to name
        const authorName = commit.commit.author.name || "Unknown"; // Keep name for display
        return [
          login, // Unique key based on login
          {
            login,
            authorName,
            commitCount: commits.filter((c) => c.author?.login === login || (!c.author?.login && c.commit.author.name === authorName)).length,
            avatarUrl: commit.author?.login
              ? `https://avatars.githubusercontent.com/${commit.author.login}`
              : "https://avatars.githubusercontent.com/u/0", // Default avatar
          },
        ];
      })
    ).values()
  );
  
  

  // Get unique authors for the dropdown
  const authors = Array.from(new Set(
    commits
      .map((commit) => commit.commit.author.name) // Extract author login
      .filter((author) => author !== undefined) // Filter out undefined values
  ));
    
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
            {/* Left section (repo info) */}
            <div>
                <h1 className="text-xl font-semibold">
                Contributor List for{" "}
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <u className="text-blue-700 text-3xl">{repoUrl.split('/').pop()}</u>
                </a>
                </h1>
                <p>Below are the contributors inferred from the commits.</p>
            </div>

            {/* Right section (Author filter dropdown) */}
            <div className="space-x-4">
                <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground mr-2">
                    Filter by User
                </label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-auto justify-between text-sm">
                        {selectedAuthor || "Select User"}
                        <User className="ml-2 h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[160px] bg-background/95 backdrop-blur-sm border-white/10">
                    <DropdownMenuItem onClick={() => setSelectedAuthor("")}>
                        All Authors
                    </DropdownMenuItem>
                    {authors.map((author) => (
                        <DropdownMenuItem key={author} onClick={() => setSelectedAuthor(author)}>
                        {author}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
        </div>

      {/* Display selected author's name and total commits */}
      {selectedAuthor && (
        <div className="text-white mb-4 flex flex-col justify-start">
          <p>
            <strong>Author:</strong> {selectedAuthor}
          </p>
          <p>
            <strong>Total Commits:</strong>{" "}
            {commits.filter((commit) => commit.commit.author.name === selectedAuthor).length}
          </p>
        </div>
      )}

      {/* List of "Forks" (Contributors) */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Contributors:</h2>
        <div className="space-y-2">
          {authorForks.length === 0 ? (
            <p>No contributors found in the commit data.</p>
          ) : (
            authorForks
              .filter(
                (fork) => !selectedAuthor || fork.authorName === selectedAuthor
              )
              .map((fork) => (
                <div key={fork.authorName} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={fork.avatarUrl}
                      alt={fork.authorName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{fork.authorName}</h3>
                      <p className="text-sm text-gray-500">
                        {fork.login || "No GitHub login"} • {fork.commitCount} commits
                      </p>
                    </div>
                  </div>
                  {fork.login && (
                    <a
                      href={`https://github.com/${fork.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 mt-2 block"
                    >
                      View Profile
                    </a>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};