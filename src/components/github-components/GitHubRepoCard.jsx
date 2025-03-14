import React from "react";
import { Flex, Card, Text, Heading, IconButton } from "@radix-ui/themes";
import { StarIcon, GitForkIcon, EyeOpenIcon, IssueOpenedIcon, GitPullRequestIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

// Single Component with Dummy Data and SVG Charts
const GitHubRepoCard = () => {
  // Dummy GitHub API Data (simulated)
  const repoData = {
    name: "email-app",
    description: "An open source email app built with modern technologies",
    stars: 4326,
    forks: 321,
    watchers: 22,
    issues: 9,
    pullRequests: 10,
    growth: [1500, 1600, 1800, 2200, 2600, 3000, 3500, 4000, 4326], // Stars over time
    activity: [2, 5, 3, 8, 20, 4, 1], // Activity per day of the week
    dates: ["Feb 13", "Feb 15", "Feb 17", "Feb 19", "Feb 21", "Feb 24", "Feb 27", "Mar 1", "Mar 5", "Mar 7", "Mar 9", "Mar 11", "Mar 14"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  // Normalize growth data for SVG (scale to fit 100px height)
  const maxGrowth = Math.max(...repoData.growth);
  const growthPoints = repoData.growth
    .map((value, index) => {
      const x = (index / (repoData.growth.length - 1)) * 300; // Scale X to 300px width
      const y = 100 - (value / maxGrowth) * 90; // Scale Y (inverted for SVG)
      return `${x},${y}`;
    })
    .join(" ");

  // Normalize activity data for SVG (scale to fit 100px height)
  const maxActivity = Math.max(...repoData.activity);
  const barWidth = 300 / repoData.activity.length; // 300px width divided by number of bars
  const activityBars = repoData.activity.map((value, index) => {
    const height = (value / maxActivity) * 90; // Scale height
    const x = index * barWidth;
    const y = 100 - height;
    return { x, y, height, width: barWidth - 5 }; // Small gap between bars
  });

  return (
    <Card style={{ backgroundColor: "#1a1a1a", color: "#fff", padding: "20px", borderRadius: "8px", width: "fit-content" }}>
      {/* Header Section */}
      <Flex direction="column" gap="2">
        <Flex align="center" gap="2">
          <GitHubLogoIcon width="24" height="24" />
          <Heading size="4">{repoData.name}</Heading>
        </Flex>
        <Text size="2" color="gray">{repoData.description}</Text>
      </Flex>

      {/* Stats Section */}
      <Flex gap="4" mt="4" wrap="wrap">
        <Flex align="center" gap="1">
          <StarIcon />
          <Text>{repoData.stars} stars</Text>
        </Flex>
        <Flex align="center" gap="1">
          <GitForkIcon />
          <Text>{repoData.forks} forks</Text>
        </Flex>
        <Flex align="center" gap="1">
          <EyeOpenIcon />
          <Text>{repoData.watchers} watchers</Text>
        </Flex>
        <Flex align="center" gap="1">
          <IssueOpenedIcon />
          <Text>{repoData.issues} issues</Text>
        </Flex>
        <Flex align="center" gap="1">
          <GitPullRequestIcon />
          <Text>{repoData.pullRequests} PRs</Text>
        </Flex>
      </Flex>

      {/* Charts Section */}
      <Flex mt="6" gap="4" direction={{ initial: "column", md: "row" }}>
        {/* Repository Growth (Line Chart) */}
        <Card style={{ backgroundColor: "#2a2a2a", padding: "10px", width: "340px" }}>
          <Text size="2" style={{ color: "#fff", marginBottom: "10px" }}>
            Repository Growth
          </Text>
          <svg width="300" height="120" style={{ display: "block", margin: "0 auto" }}>
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="#333" strokeWidth="1" />

            {/* Growth Line */}
            <polyline points={growthPoints} fill="none" stroke="#8884d8" strokeWidth="2" />

            {/* X-axis Labels */}
            {repoData.dates.map((date, index) => (
              <text
                key={date}
                x={(index / (repoData.dates.length - 1)) * 300}
                y="115"
                fill="#aaa"
                fontSize="10"
                textAnchor="middle"
              >
                {date}
              </text>
            ))}
          </svg>
        </Card>

        {/* Recent Activity (Bar Chart) */}
        <Card style={{ backgroundColor: "#2a2a2a", padding: "10px", width: "340px" }}>
          <Text size="2" style={{ color: "#fff", marginBottom: "10px" }}>
            Recent Activity
          </Text>
          <svg width="300" height="120" style={{ display: "block", margin: "0 auto" }}>
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="#333" strokeWidth="1" />

            {/* Activity Bars */}
            {activityBars.map((bar, index) => (
              <rect
                key={index}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill="#8884d8"
              />
            ))}

            {/* X-axis Labels */}
            {repoData.days.map((day, index) => (
              <text
                key={day}
                x={index * barWidth + barWidth / 2}
                y="115"
                fill="#aaa"
                fontSize="10"
                textAnchor="middle"
              >
                {day}
              </text>
            ))}
          </svg>
        </Card>
      </Flex>

      {/* GitHub Link */}
      <Flex justify="end" mt="4">
        <IconButton variant="soft" asChild>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <GitHubLogoIcon />
            View on GitHub
          </a>
        </IconButton>
      </Flex>
    </Card>
  );
};

export default GitHubRepoCard;