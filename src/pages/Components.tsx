
import React, { useState } from 'react';
import { Header } from '@/components/Header';
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
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Component Gallery</h1>
          <p className="text-xl text-muted-foreground">
            Browse, preview, and copy our component library to use in your projects
          </p>
        </div>

        <Tabs defaultValue="charts" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-background/10 p-1 border">
              <TabsTrigger value="charts" className="px-6 py-2">Charts</TabsTrigger>
              <TabsTrigger value="contributors" className="px-6 py-2">Contributors</TabsTrigger>
              <TabsTrigger value="ui" className="px-6 py-2">UI Components</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="charts" className="space-y-12">
            <ComponentDemo 
              title="Timeline Chart" 
              description="Visualize commit history over time with this responsive bar chart."
              code={`import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Place this component within a parent container with defined dimensions
<ResponsiveContainer width="100%" height={400}>
  <BarChart
    data={timelineData}
    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
    <XAxis dataKey="date" angle={-45} textAnchor="end" />
    <YAxis label={{ value: 'Number of Commits', angle: -90, position: 'insideLeft' }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="commits" name="Commits Frequency" fill="rgb(59, 130, 246)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>`}
            >
              <div className="h-[400px] w-full">
                <CommitChart commits={mockCommits} />
              </div>
            </ComponentDemo>

            <ComponentDemo 
              title="Contributors Pie Chart" 
              description="Display the distribution of commits by contributor with this interactive pie chart."
              code={`import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Define colors array
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Place this component within a parent container with defined dimensions
<ResponsiveContainer width="100%" height={400}>
  <PieChart>
    <Pie
      data={authorData}
      cx="50%"
      cy="50%"
      labelLine={true}
      label={({ name, percent }) => \`\${name} (\${(percent * 100).toFixed(0)}%)\`}
      outerRadius={150}
      fill="#8884d8"
      dataKey="value"
      nameKey="name"
    >
      {authorData.map((entry, index) => (
        <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value) => [\`\${value} commits\`, 'Contributions']} />
  </PieChart>
</ResponsiveContainer>`}
            >
              <div className="h-[400px] w-full">
                <CommitChart commits={mockCommits} />
              </div>
            </ComponentDemo>

            <ComponentDemo 
              title="Commit Frequency Line Chart" 
              description="Track commit patterns over time with this smooth line chart visualization."
              code={`import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Place this component within a parent container with defined dimensions
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
    <XAxis dataKey="date" angle={-45} textAnchor="end" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="commits" stroke="rgb(59, 130, 246)" dot={false} />
  </LineChart>
</ResponsiveContainer>`}
            >
              <div className="h-[400px] w-full">
                <div className="glass-morphism rounded-xl p-6">
                  <Tabs defaultValue="commit-frequency">
                    <TabsList className="hidden">
                      <TabsTrigger value="commit-frequency">Commit Frequency</TabsTrigger>
                    </TabsList>
                    <TabsContent value="commit-frequency">
                      <div className="h-[400px] w-full">
                        <CommitChart commits={mockCommits} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ComponentDemo>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-12">
            <ComponentDemo 
              title="Contributors List" 
              description="Display a list of repository contributors with their statistics."
              code={`import React from 'react';

const ForkList = ({ commits, repoUrl }) => {
  // Group commits by author
  const authorForks = Array.from(
    new Map(
      commits.map((commit) => {
        const login = commit.author?.login || commit.commit.author.name || "Unknown";
        const authorName = commit.commit.author.name || "Unknown";
        return [
          login,
          {
            login,
            authorName,
            commitCount: commits.filter(
              (c) => c.author?.login === login || 
              (!c.author?.login && c.commit.author.name === authorName)
            ).length,
            avatarUrl: commit.author?.login
              ? \`https://avatars.githubusercontent.com/\${commit.author.login}\`
              : "https://avatars.githubusercontent.com/u/0",
          },
        ];
      })
    ).values()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Contributors:</h2>
      <div className="space-y-2">
        {authorForks.map((fork) => (
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
                href={\`https://github.com/\${fork.login}\`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 mt-2 block"
              >
                View Profile
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForkList;`}
            >
              <div className="glass-morphism rounded-xl p-6">
                <ForkList commits={mockCommits} repoUrl="https://github.com/example/repo" />
              </div>
            </ComponentDemo>
          </TabsContent>

          <TabsContent value="ui" className="space-y-12">
            <ComponentDemo 
              title="Glass Morphism Cards" 
              description="Beautiful frosted glass effect cards for a modern UI."
              code={`<div className="glass-morphism rounded-xl p-6">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-muted-foreground">This is a glass morphism card with a frosted effect.</p>
</div>

/* CSS for glass-morphism effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-morphism rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Glass Card</h3>
                  <p className="text-muted-foreground">This beautiful card uses the glass morphism effect with a frosted backdrop.</p>
                </div>
                <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <h3 className="text-xl font-semibold mb-2">Gradient Glass Card</h3>
                  <p className="text-muted-foreground">Combines glass morphism with a subtle gradient background.</p>
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo 
              title="Progress Indicators" 
              description="Visualize progress with these customizable bars."
              code={`import { Progress } from "@/components/ui/progress";

<Progress value={25} className="h-2 w-full" />
<Progress value={50} className="h-2 w-full bg-blue-950" /> 
<Progress value={75} className="h-2 w-full" />`}
            >
              <div className="space-y-6 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium">25% Complete</label>
                  <Progress value={25} className="h-2 w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">50% Complete</label>
                  <Progress value={50} className="h-2 w-full bg-blue-950" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">75% Complete</label>
                  <Progress value={75} className="h-2 w-full" />
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo 
              title="AspectRatio Component" 
              description="Maintain aspect ratios for images and other content."
              code={`import { AspectRatio } from "@/components/ui/aspect-ratio"

<div className="w-full">
  <AspectRatio ratio={16/9}>
    <img 
      src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" 
      alt="Image" 
      className="rounded-md object-cover w-full h-full" 
    />
  </AspectRatio>
</div>`}
            >
              <div className="w-full max-w-md mx-auto">
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" 
                    alt="Image" 
                    className="rounded-md object-cover w-full h-full" 
                  />
                </AspectRatio>
              </div>
            </ComponentDemo>

            <ComponentDemo 
              title="Card Components" 
              description="Versatile card components for displaying content."
              code={`import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Simple Card</h3>
                    <p className="text-muted-foreground">A basic card component for displaying content.</p>
                  </div>
                </Card>
                <Card className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" 
                      alt="Image" 
                      className="object-cover w-full h-full" 
                    />
                  </AspectRatio>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Media Card</h3>
                    <p className="text-muted-foreground">Card with image and content.</p>
                  </div>
                </Card>
              </div>
            </ComponentDemo>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Components;
