import { useState } from 'react';
import Header from '../components/Header';
import CommitTable from '../components/CommitTable';
import { Commit } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setCachedData, getCachedData } from '../lib/cache'; // Supabase caching functions
import { log } from 'node:console';

const Index = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Parse the GitHub repository URL to extract owner and repo
  const parseRepoUrl = (url: string): [string, string] => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) return [match[1], match[2]];
    return url.split('/').slice(-2) as [string, string];
  };

  // Fetch all branches and their commits from GitHub API or Supabase cache
  const fetchCommits = async (owner: string, repo: string): Promise<Commit[]> => {
    const cacheKey = `${owner}/${repo}`;
  
    // Check Supabase cache first
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedData;
    }
  
    // Fetch all branches
    const branchesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers: {
        Authorization: ``,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!branchesResponse.ok) throw new Error('Failed to fetch branches');
    const branches = await branchesResponse.json();
    const branchNames = branches.map((b: any) => b.name);
  
    // Fetch commits for all branches
    const allCommits: Commit[] = [];
    const perPage = 100;
  
    for (const branch of branchNames) {
      let page = 1;
      let hasMoreCommits = true;
  
      while (hasMoreCommits) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${perPage}&page=${page}`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization:``,
            Accept: 'application/vnd.github+json',
          },
        });
        console.log(response);
        
  
        if (!response.ok) {
          if (response.status === 403) throw new Error('API rate limit exceeded');
          throw new Error(`Failed to fetch commits for branch ${branch}: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.length === 0) {
          hasMoreCommits = false;
        } else {
          // Fetch detailed commit data including files
          const commitsWithFiles = await Promise.all(
            data.map(async (commit: any) => {
              const commitResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`,
                {
                  headers: {
                    Authorization: ``,
                    Accept: 'application/vnd.github+json',
                  },
                }
              );
              const commitData = await commitResponse.json();
              return {
                ...commit,
                files: commitData.files || [],
                branch, // Add branch info to each commit
              };
            })
          );
  
          allCommits.push(...commitsWithFiles);
        }
  
        page++; // Increment to fetch the next page
      }
    }
  
    // Save fetched data to Supabase cache
    await setCachedData(cacheKey, allCommits);
    return allCommits;
  };
  

  // Handle fetching commits when the user clicks "Search"
  const handleFetchCommits = async () => {
    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [owner, repo] = parseRepoUrl(repoUrl);
      const commitData = await fetchCommits(owner, repo);
      setCommits(commitData); // Set fetched commits
    } catch (err: any) {
      setError(`Error fetching commits: ${err.message}`); // Log detailed error
    } finally {
      setLoading(false); // Ensure loading state is turned off
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">

      <div className="container px-4 py-7 mx-auto max-w-7xl">
        <Header />
        <div className="glass-morphism rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">GitHub Repository</h2>
          <div className="flex space-x-2 mt-8">
            <Input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter GitHub repository URL (e.g. github.com/user/repo)"
              className="bg-background/95 border-white/10 mr-2"
            />
            <Button size="lg" onClick={handleFetchCommits}>Search</Button>
          </div>
        </div>

        {/* Only render CommitTable if there's data or error */}
        {commits.length > 0 || error ? (
          <CommitTable
            commits={commits}
            loading={loading}
            error={error}
            repoUrl={repoUrl}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Index;