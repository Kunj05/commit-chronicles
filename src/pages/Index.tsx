"use client"
import { useState, useEffect } from "react";
import Header from "../components/Header";
import CommitTable from "../components/CommitTable";
import { Commit } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setCachedData, getCachedData } from "../lib/cache"; // Supabase caching functions

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [repoSuggestions, setRepoSuggestions] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // GitHub GraphQL endpoint and token
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Replace with your PAT
  const ENDPOINT = "https://api.github.com/graphql";

  useEffect(() => {
    const fetchRepos = async () => {
      if (!searchQuery) {
        setRepoSuggestions([]);
        setIsDropdownOpen(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            searchQuery
          )}&per_page=5`
        );
        const data = await response.json();
        setRepoSuggestions(data.items || []);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setRepoSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchRepos, 300); // Debounce to limit API calls
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const parseRepoUrl = (url: string): [string, string] => {
    // Handle format: username/repo
    if (url.split('/').length === 2) {
      const [owner, repo] = url.split('/');
      return [owner, repo];
    }
    
    // Handle full GitHub URLs
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return [pathParts[0], pathParts[1]];
      }
    } catch (e) {
      // Not a valid URL
    }
    
    throw new Error("Invalid GitHub repository URL format");
  };

  const fetchCommits = async (owner: string, repo: string): Promise<Commit[]> => {
    const cacheKey = `${owner}/${repo}`;

    // Check Supabase cache first
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedData;
    }

    // Fetch all branches
    const branchesQuery = `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          refs(first: 100, refPrefix: "refs/heads/") {
            edges {
              node {
                name
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const branches: string[] = [];
    let afterCursor: string | null = null;

    do {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: branchesQuery.replace("after: null", afterCursor ? `after: "${afterCursor}"` : "after: null") }),
      });

      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      if (data.errors) throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);

      const refs = data.data.repository.refs;
      branches.push(...refs.edges.map((edge: any) => edge.node.name));
      afterCursor = refs.pageInfo.hasNextPage ? refs.pageInfo.endCursor : null;
    } while (afterCursor);

    // Fetch commits for all branches
    const allCommits: Commit[] = [];

    for (const branch of branches) {
      let commitsAfter: string | null = null;
      let hasMoreCommits = true;

      while (hasMoreCommits) {
        const commitsQuery = `
          query {
            repository(owner: "${owner}", name: "${repo}") {
              ref(qualifiedName: "refs/heads/${branch}") {
                target {
                  ... on Commit {
                    history(first: 100${commitsAfter ? `, after: "${commitsAfter}"` : ""}) {
                      edges {
                        node {
                          oid
                          message
                          author {
                            name
                            email
                            date
                            user {
                              login
                            }
                          }
                          committedDate
                          files: associatedPullRequests(first: 1) {
                            edges {
                              node {
                                commits(first: 1) {
                                  edges {
                                    node {
                                      commit {
                                        changedFilesIfAvailable
                                        tree {
                                          entries {
                                            name
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: commitsQuery }),
        });

        if (!response.ok) throw new Error(`Failed to fetch commits for branch ${branch}`);
        const data = await response.json();
        if (data.errors) throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);

        const history = data.data.repository.ref?.target.history;
        if (!history) {
          hasMoreCommits = false;
          continue; // Skip if no commits or branch is invalid
        }
        setLoading(true);
        const commitEdges = history.edges;
        const commitsWithDetails = commitEdges.map((edge: any) => {
          const node = edge.node;
          const files = node.files?.edges[0]?.node.commits.edges[0]?.node.commit.tree.entries.map((entry: any) => ({
            filename: entry.name,
          })) || [];

          return {
            sha: node.oid,
            commit: {
              message: node.message,
              author: {
                name: node.author.name,
                email: node.author.email,
                date: node.author.date,
              },
            },
            author: {
              login: node.author.user?.login || node.author.name,
              name: node.author.name,
              date: node.author.date,
            },
            files,
            branch,
          } as Commit;
        });

        allCommits.push(...commitsWithDetails);
        hasMoreCommits = history.pageInfo.hasNextPage;
        commitsAfter = history.pageInfo.endCursor;
      }
    }

    // Save fetched data to Supabase cache
    await setCachedData(cacheKey, allCommits);
    return allCommits;
  };

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setSearchQuery(repo.full_name); // Display the selected repo's full name
    setIsDropdownOpen(false);
  };

  const handleFetchCommits = async () => {
    setRepoUrl(selectedRepo.full_name);
    if (!selectedRepo ) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [owner, repo] = parseRepoUrl(repoUrl);
      const commitData = await fetchCommits(owner, repo);
      setCommits(commitData);
    } catch (err: any) {
      setError(`Error fetching commits: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <div className="container px-4 py-7 mx-auto max-w-7xl">
        <Header />
        <div className="glass-morphism rounded-xl p-6 space-y-4 relative">
          <h2 className="text-xl font-semibold mb-2">GitHub Repository</h2>
          <div className="flex space-x-2 mt-8">
            <div className="relative w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Your GitHub repositories (e.g., Username/repo-name)"
                className="bg-background/95 border-white/10 mr-2 w-full"
              />
              {isDropdownOpen && repoSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-background/95 border border-white/10 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {repoSuggestions.map((repo) => (
                    <li
                      key={repo.id}
                      className="p-2 hover:bg-white/10 cursor-pointer"
                      onClick={() => handleSelectRepo(repo)}
                    >
                      {repo.full_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button size="lg" onClick={handleFetchCommits}>
              Search
            </Button>
          </div>
        </div>
        
        {loading && (  
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
        )}
  
        {commits.length > 0 || error ? (
          <CommitTable commits={commits} loading={loading} error={error} repoUrl={repoUrl} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Index;
