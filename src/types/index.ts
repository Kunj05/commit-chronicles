export interface Commit {
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  files?: { filename: string }[];
  sha: string;
  branch?: string; // Add this (optional if not all commits have it)
  author: {
    login: string;
    name: string;
    date: string;
  };
}