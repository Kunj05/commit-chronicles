
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CommitTable from '../components/CommitTable';
import dummyCommits from '../data/dummyCommits';
import { Commit } from '../types';

const Index = () => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setCommits(dummyCommits);
        setLoading(false);
      } catch (err) {
        setError('Failed to load commits');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter commits based on search query
  const filteredCommits = commits.filter(commit => {
    const searchLower = searchQuery.toLowerCase();
    return (
      commit.commit.message.toLowerCase().includes(searchLower) ||
      commit.commit.author.name.toLowerCase().includes(searchLower) ||
      commit.sha.toLowerCase().includes(searchLower) ||
      (commit.files || []).some(file => 
        file.filename.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <Header />
        
        <div className="mt-8">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          <CommitTable 
            commits={filteredCommits}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
