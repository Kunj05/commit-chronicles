
import React, { useMemo,useState } from 'react';
import { Commit } from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User } from 'lucide-react';


interface CommitChartProps {
  commits: Commit[];
}


export const CommitChart: React.FC<CommitChartProps> = ({ commits }) => {
  const [selectedAuthor, setSelectedAuthor] = useState("");


  // Process data for Author Commits chart
  const authorData = useMemo(() => {
    const authorCounts: Record<string, number> = {};
    
    commits.forEach(commit => {
      const author = commit.author?.login;
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });
    
    return Object.entries(authorCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [commits]);
  
  // Process data for commit activity by date
  const timelineData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      dateMap[formattedDate] = (dateMap[formattedDate] || 0) + 1;
    });
    
    return Object.entries(dateMap)
      .map(([date, count]) => ({
        date,
        commits: count
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [commits]);

  const stackedData = useMemo(() => {
    const authorDailyCommits = {};

    commits.forEach((commit) => {
      const date = new Date(commit.commit.author.date);
      const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      const author = commit.commit.author.name;

      if (!authorDailyCommits[formattedDate]) {
        authorDailyCommits[formattedDate] = {};
      }

      authorDailyCommits[formattedDate][author] = (authorDailyCommits[formattedDate][author] || 0) + 1;
    });

    return Object.entries(authorDailyCommits).map(([date, authors]) => ({
      date,
      ...authors,
    }));
  }, [commits]);

  const authors = useMemo(() => {
    const authorSet = new Set();
    commits.forEach((commit) => {
      const author = commit.author?.login;
      if (author) {  // Only add valid (non-undefined) author logins
        authorSet.add(author);
      }
    });
    return Array.from(authorSet);
  }, [commits]);
  
  // Filter the stacked data for the selected author
  const filteredData = stackedData.map((entry) => ({
    date: entry.date,
    [selectedAuthor]: entry[selectedAuthor] || 0,
  }));

  const totalCommits = useMemo(() => {
    return stackedData.reduce((total, entry) => total + (entry[selectedAuthor] || 0), 0);
  }, [selectedAuthor, stackedData]);


  const lineChartData = useMemo(() => {
    return timelineData.map(({ date, commits }) => ({
      date,
      commits,
    }));
  }, [timelineData]);
  
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Commit Visualization</h3>
          <TabsList className="bg-background/10 p-1">
            <TabsTrigger value="timeline" className='border mr-2  '>Timeline</TabsTrigger>
            <TabsTrigger value="authors" className='border mr-2 '>Contributors</TabsTrigger>
            <TabsTrigger value="activity-by-user" className='border mr-2 '>activity-by-user</TabsTrigger>
            <TabsTrigger value="commit-frequency" className='border'>commit-frequency</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="timeline" className="mt-0">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  height={60}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  label={{ 
                    value: 'Number of Commits', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.6)',
                    dy:100,
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  labelStyle={{ fontWeight: 'bold', color: 'white' }}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                <Bar 
                  dataKey="commits" 
                  name="Commits Frequency" 
                  fill="rgb(59, 130, 246)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowUpIcon className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">
                {timelineData.length > 0 ? 
                  `${timelineData.reduce((sum, item) => sum + item.commits, 0)} commits across ${timelineData.length} days` : 
                  'No timeline data available'}
              </span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="authors" className="mt-0">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={authorData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {authorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  formatter={(value) => [`${value} commits`, 'Contributions']}
                  itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  labelStyle={{ fontWeight: 'bold', color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowDownIcon className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">
                {authorData.length > 0 ? 
                  `${authorData.length} contributors across ${commits.length} commits` : 
                  'No author data available'}
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity-by-user" className="mt-0">
          <div className="h-[400px] w-full">
            <div className="flex justify-center gap-80">
              {/* Dropdown to select author on the right */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground mr-2">Filter by User</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-auto justify-between text-sm">
                      {selectedAuthor || "Select User"}
                      <User className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[160px] bg-background/95 backdrop-blur-sm border-white/10">
                    <DropdownMenuItem onClick={() => setSelectedAuthor('')}>
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

              {/* Display selected author's name and total commits */}
              {selectedAuthor && (
                <div className="text-white mb-1 flex flex-col justify-end">
                  <p><strong>Author:</strong> {selectedAuthor}</p>
                  <p><strong>Total Commits:</strong> {totalCommits}</p>
                </div>
              )}
            </div>


          {/* Bar Chart */}
          {selectedAuthor && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} ticks={[0, 4, 8 , 12 ]} 
                label={{ 
                  value: 'Number of Commits', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: 'rgba(255,255,255,0.6)',
                  dy:100,
                }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey={selectedAuthor}
                  fill={COLORS[0]} // Use first color in the palette
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          </div>
        </TabsContent>

        <TabsContent value="commit-frequency" className="mt-0">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="commits" stroke="rgb(59, 130, 246)" dot={false} label={{ dy: 10 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};
