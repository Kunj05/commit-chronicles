import React from "react";
import { Flex, Card, Text, Heading, IconButton, Avatar } from "@radix-ui/themes";
import {
  Github,
  Star,
  GitFork,
  MessageCircle,
  GitGraph,
  ChartAreaIcon,
  GitPullRequest,
  LayoutGrid,
  FileCode,
} from "lucide-react";

// Single Component with Dummy Data
const GitHubRepoCard = () => {
  // Dummy GitHub API Data (simulated)
  const mockRepoData = {
    name: "email-app",
    description: "An open source email app built with modern technologies",
    html_url: "https://github.com/mockuser/email-app",
    stats: {
      stars: 4326,
      forks: 321,
      watchers: 22,
      issues: 9,
      pullRequests: 10,
    },
    growth: [1500, 1600, 1800, 2200, 2600, 3000, 3500, 4000, 4326],
    activity: [2, 5, 3, 8, 20, 4, 1],
    dates: ["Feb 13", "Feb 15", "Feb 17", "Feb 19", "Feb 21", "Feb 24", "Feb 27", "Mar 1", "Mar 5", "Mar 7", "Mar 9", "Mar 11", "Mar 14"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    commits: [
      {
        sha: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
        branch: "main",
        commit: {
          message: "Fix all the bugs",
          author: {
            name: "John Doe",
            email: "john@example.com",
            date: "2023-06-01T12:00:00Z",
          },
        },
        author: {
          login: "johndoe",
          avatar_url: "https://avatars.githubusercontent.com/u/1234567",
        },
        files: [
          { filename: "src/App.tsx", status: "modified" },
          { filename: "src/components/Button.tsx", status: "modified" },
        ],
      },
      {
        sha: "7dcb09b5b57875f334f61aebed695e2e4193db5f",
        branch: "main",
        commit: {
          message: "Add new feature",
          author: {
            name: "Jane Smith",
            email: "jane@example.com",
            date: "2023-06-02T12:00:00Z",
          },
        },
        author: {
          login: "janesmith",
          avatar_url: "https://avatars.githubusercontent.com/u/7654321",
        },
        files: [{ filename: "src/components/Feature.tsx", status: "added" }],
      },
      {
        sha: "8dcb09b5b57875f334f61aebed695e2e4193db5g",
        branch: "dev",
        commit: {
          message: "Update README.md",
          author: {
            name: "Alex Johnson",
            email: "alex@example.com",
            date: "2023-06-03T12:00:00Z",
          },
        },
        author: {
          login: "alexjohnson",
          avatar_url: "https://avatars.githubusercontent.com/u/2345678",
        },
        files: [{ filename: "README.md", status: "modified" }],
      },
    ],
    contributors: [
      {
        login: "johndoe",
        avatar_url: "https://avatars.githubusercontent.com/u/1234567",
        contributions: 120,
      },
      {
        login: "janesmith",
        avatar_url: "https://avatars.githubusercontent.com/u/7654321",
        contributions: 85,
      },
      {
        login: "alexjohnson",
        avatar_url: "https://avatars.githubusercontent.com/u/2345678",
        contributions: 45,
      },
    ],
  };

  // Normalize growth data for SVG
  const maxGrowth = Math.max(...mockRepoData.growth);
  const growthPoints = mockRepoData.growth
    .map((value, index) => {
      const x = (index / (mockRepoData.growth.length - 1)) * 300;
      const y = 100 - (value / maxGrowth) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  // Normalize activity data for SVG
  const maxActivity = Math.max(...mockRepoData.activity);
  const barWidth = 300 / mockRepoData.activity.length;
  const activityBars = mockRepoData.activity.map((value, index) => {
    const height = (value / maxActivity) * 90;
    const x = index * barWidth;
    const y = 100 - height;
    return { x, y, height, width: barWidth - 5 };
  });

  return (
    <div className="mb-8 overflow-hidden rounded-xl border bg-gradient-to-b from-white/50 to-white/10 p-6 backdrop-blur-sm dark:border-neutral-700 dark:from-neutral-900/50 dark:to-neutral-900/30">
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="relative h-8 w-8">
              <Image
                src="/black-icon.svg"
                alt="0.email Logo"
                fill
                className="object-contain dark:hidden"
              />
              <Image
                src="/white-icon.svg"
                alt="0.email Logo"
                fill
                className="hidden object-contain dark:block"
              />
            </div>
          </Link>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          An open source email app built with modern technologies
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 border-neutral-200 bg-white/50 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <Link href={`https://github.com/${REPOSITORY}`} target="_blank">
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
        </Button>
      </div>
    </div>

    <Separator className="my-6 dark:bg-neutral-700" />

    <div className="flex flex-wrap items-center divide-x divide-neutral-200 dark:divide-neutral-700">
      <div className="flex items-center gap-3 px-3 first:pl-0 last:pr-0 sm:px-4">
        <Star className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-white">
            {repoStats.stars}
          </span>
          <span className="hidden text-xs text-neutral-500 sm:inline dark:text-neutral-400">
            &nbsp;stars
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 first:pl-0 last:pr-0 sm:px-4">
        <GitFork className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-white">
            {repoStats.forks}
          </span>
          <span className="hidden text-xs text-neutral-500 sm:inline dark:text-neutral-400">
            &nbsp;forks
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-3 px-3 first:pl-0 last:pr-0 sm:flex sm:px-4">
        <Github className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-white">
            {repoStats.watchers}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            &nbsp;watchers
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 first:pl-0 last:pr-0 sm:px-4">
        <MessageCircle className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-white">
            {repoStats.openIssues}
          </span>
          <span className="hidden text-xs text-neutral-500 sm:inline dark:text-neutral-400">
            &nbsp;issues
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 first:pl-0 last:pr-0 sm:px-4">
        <GitPullRequest className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-white">
            {repoStats.openPRs}
          </span>
          <span className="hidden text-xs text-neutral-500 sm:inline dark:text-neutral-400">
            &nbsp;PRs
          </span>
        </div>
      </div>
    </div>

    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {/* Repository Growth */}
      <Card className="col-span-full border-neutral-100 bg-white/50 p-4 transition-all hover:bg-white/60 lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/60">
        <h3 className="mb-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Repository Growth
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={timelineData} className="-mx-5 mt-2">
            <defs>
              <linearGradient id="stars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(64, 64, 64)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(64, 64, 64)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="starsDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(255, 255, 255)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="rgb(255, 255, 255)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(64, 64, 64)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(64, 64, 64)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forksDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(200, 200, 200)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(200, 200, 200)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="text-neutral-600 dark:text-neutral-400"
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              className="text-neutral-600 dark:text-neutral-400"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-neutral-900 dark:text-white" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Stars:
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitFork className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Forks:
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {payload[1]?.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="stars"
              stroke="rgb(64, 64, 64)"
              strokeWidth={2}
              fill="url(#stars)"
              className="dark:fill-[url(#starsDark)] dark:stroke-white"
            />
            <Area
              type="monotone"
              dataKey="forks"
              stroke="rgb(64, 64, 64)"
              strokeWidth={2}
              fill="url(#forks)"
              className="dark:fill-[url(#forksDark)] dark:stroke-neutral-300"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Activity Chart */}
      <Card className="col-span-full border-neutral-200 bg-white/50 p-4 transition-all hover:bg-white/60 lg:col-span-1 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/60">
        <h3 className="mb-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Recent Activity
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={activityData} className="-mx-5 mt-2" layout="horizontal">
            <XAxis
              dataKey="date"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="text-neutral-600 dark:text-neutral-400"
              interval={0}
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="text-neutral-600 dark:text-neutral-400"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <GitGraph className="h-4 w-4 text-neutral-900 dark:text-white" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Commits:
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Issues:
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {payload[1]?.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitPullRequest className="h-4 w-4 text-neutral-500 dark:text-neutral-500" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            PRs:
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {payload[2]?.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="commits"
              radius={[4, 4, 0, 0]}
              className="fill-neutral-900 dark:fill-white"
            />
            <Bar
              dataKey="issues"
              radius={[4, 4, 0, 0]}
              className="fill-neutral-700 dark:fill-neutral-300"
            />
            <Bar
              dataKey="pullRequests"
              radius={[4, 4, 0, 0]}
              className="fill-neutral-500 dark:fill-neutral-500"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);
};

export default GitHubRepoCard;