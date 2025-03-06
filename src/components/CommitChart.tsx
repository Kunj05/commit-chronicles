
import React, { useMemo } from 'react';
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
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface CommitChartProps {
  commits: Commit[];
}

export const CommitChart: React.FC<CommitChartProps> = ({ commits }) => {
  // Process data for Author Commits chart
  const authorData = useMemo(() => {
    const authorCounts: Record<string, number> = {};
    
    commits.forEach(commit => {
      const author = commit.commit.author.name;
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
      const dateStr = date.toLocaleDateString();
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });
    
    return Object.entries(dateMap)
      .map(([date, count]) => ({
        date,
        commits: count
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [commits]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Commit Visualization</h3>
          <TabsList className="bg-background/10 p-1">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="authors">Contributors</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="timeline" className="mt-0">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
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
                    value: 'Commits', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.6)'
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
                  name="Number of Commits" 
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
      </Tabs>
    </div>
  );
};
