
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CommitTable from '../components/CommitTable';
import dummyCommits from '../data/dummyCommits';
import { Commit } from '../types';

const Index = () => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <Header />
        
        <div className="mt-8">
          <CommitTable 
            commits={commits}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
