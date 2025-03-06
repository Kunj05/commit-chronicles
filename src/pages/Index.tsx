import  { useState } from 'react';
import Header from '../components/Header';
import CommitTable from '../components/CommitTable';
import { Commit } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [repoUrl, setRepoUrl] = useState('')
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseRepoUrl = (url: string): [string, string] => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) return [match[1], match[2]];
    return url.split('/').slice(-2) as [string, string];
  };
  const getCachedCommits = (key: string): Commit[] | null => {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600000) return data; 
    }
    return null;
  };

  const setCachedCommits = (key: string, data: Commit[]) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  const fetchCommits = async (owner: string, repo: string, lastModified: string = '') => {
    const cacheKey = `${owner}/${repo}`;
    const cachedData = getCachedCommits(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedData;
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const allCommits: Commit[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(`${apiUrl}?per_page=${perPage}&page=${page}`, {
        headers: {
                    Authorization: `${process.env.Github_token}` ,
          Accept: 'application/vnd.github+json',
          'If-Modified-Since': lastModified || '',
        },
      });
      console.log("response",response);
      
      if (!response.ok) {
        if (response.status === 403) throw new Error('API rate limit exceeded');
        if (response.status === 304) {
          console.log('No new commits since last fetch.');
          return getCachedCommits(cacheKey) || [];
        }
        throw new Error(`Failed to fetch commits: ${response.status}`);
      }

      const data = await response.json();
      if (!data.length) break;

      const commitsWithFiles = await Promise.all(
        data.map(async (commit: any) => {
          const commitResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`,
            {
              headers: {
                Authorization: process.env.Github_token,
                Accept: 'application/vnd.github+json',
              },
            }
          );
          const commitData = await commitResponse.json();
          return {
            ...commit,
            files: commitData.files || [],
          };
        })
      );

      allCommits.push(...commitsWithFiles);
      page++;
    }

    setCachedCommits(cacheKey, allCommits);
    return allCommits;
  };

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
      setCommits(commitData);
    } catch (err: any) {
      setError('Error fetching commits. Check the URL or try again later.');
    } finally {
      setLoading(false);
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
                placeholder="Enter GitHub repository URL (e.g.  github.com/user/repo)"
                className="bg-background/95 border-white/10"
              />
              <Button size="lg" onClick={handleFetchCommits}>Search</Button>
            </div>
          </div>
          {
            repoUrl && commits ?
              <CommitTable 
                commits={commits}
                loading={loading}
                error={error}
                repoUrl={repoUrl}
              />:
            <></>
          }
      </div>
    </div>
  );
};

export default Index;
