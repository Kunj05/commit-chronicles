
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Code, Copy } from 'lucide-react';
import { CommitChart } from '@/components/CommitChart';
import { ForkList } from '@/components/ForkList';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ComponentDemo } from '@/components/ComponentDemo';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
// Mock data for demos
const mockCommits = [
  {
    sha: '6dcb09b5b57875f334f61aebed695e2e4193db5e',
    branch: 'main',
    commit: {
      message: 'Fix all the bugs',
      author: {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2023-06-01T12:00:00Z'
      }
    },
    author: {
      login: 'johndoe',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
    },
    files: [
      { filename: 'src/App.tsx', status: 'modified' },
      { filename: 'src/components/Button.tsx', status: 'modified' }
    ]
  },
  {
    sha: '7dcb09b5b57875f334f61aebed695e2e4193db5f',
    branch: 'main',
    commit: {
      message: 'Add new feature',
      author: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        date: '2023-06-02T12:00:00Z'
      }
    },
    author: {
      login: 'janesmith',
      avatar_url: 'https://avatars.githubusercontent.com/u/7654321'
    },
    files: [
      { filename: 'src/components/Feature.tsx', status: 'added' }
    ]
  },
  {
    sha: '8dcb09b5b57875f334f61aebed695e2e4193db5g',
    branch: 'dev',
    commit: {
      message: 'Update README.md',
      author: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        date: '2023-06-03T12:00:00Z'
      }
    },
    author: {
      login: 'alexjohnson',
      avatar_url: 'https://avatars.githubusercontent.com/u/2345678'
    },
    files: [
      { filename: 'README.md', status: 'modified' }
    ]
  },
  {
    sha: '9dcb09b5b57875f334f61aebed695e2e4193db5h',
    branch: 'feature/login',
    commit: {
      message: 'Implement login functionality',
      author: {
        name: 'Sam Wilson',
        email: 'sam@example.com',
        date: '2023-06-04T12:00:00Z'
      }
    },
    author: {
      login: 'samwilson',
      avatar_url: 'https://avatars.githubusercontent.com/u/3456789'
    },
    files: [
      { filename: 'src/pages/Login.tsx', status: 'added' },
      { filename: 'src/components/LoginForm.tsx', status: 'added' },
      { filename: 'src/hooks/useAuth.tsx', status: 'added' }
    ]
  },
  {
    sha: '0dcb09b5b57875f334f61aebed695e2e4193db5i',
    branch: 'main',
    commit: {
      message: 'Fix login bugs',
      author: {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2023-06-05T12:00:00Z'
      }
    },
    author: {
      login: 'johndoe',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
    },
    files: [
      { filename: 'src/hooks/useAuth.tsx', status: 'modified' }
    ]
  }
];

const Components: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
    
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Component Gallery</h1>
          <p className="text-xl text-muted-foreground">
            Comming Soon......
          </p>
        </div>

      </main>
    </div>
  );
};

export default Components;
