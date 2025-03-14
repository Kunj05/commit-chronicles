
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Code, GitBranch, Search, FileCode, Users } from "lucide-react";
import HomeNav from "@/components/HomeNav";
import FeatureCard from "@/components/FeatureCard";
import FaqItem from "@/components/FaqItem";

const Home = () => {
  const features = [
    {
      title: "Commit History Visualization",
      description: "Explore your repository's commit history with beautiful, interactive visualizations.",
      icon: <GitBranch className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Author Analytics",
      description: "Track contributions by author, identify key contributors, and analyze team performance.",
      icon: <Users className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Code Changes Tracking",
      description: "Monitor file modifications, additions, and deletions across branches and time periods.",
      icon: <FileCode className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Advanced Filtering",
      description: "Filter commits by author, date range, files, and more to focus on what matters to you.",
      icon: <Search className="h-12 w-12 text-blue-500" />,
    },
  ];

  const faqs = [
    {
      question: "How do I get started with Commit Chronicles?",
      answer: "Simply navigate to the Explorer page, enter your GitHub repository URL, and click search. We'll fetch and display all commit information for you.",
    },
    {
      question: "Does Commit Chronicles work with private repositories?",
      answer: "Yes! As long as you provide a valid GitHub token with appropriate permissions, you can analyze private repositories too.",
    },
    {
      question: "Can I filter commits by date or author?",
      answer: "Absolutely! The Explorer page offers comprehensive filtering options including by author, date range, and even specific files or commit messages.",
    },
    {
      question: "Is my GitHub token secure?",
      answer: "Yes, your GitHub token is only stored in your browser's local storage and is never shared with our servers. It's used solely to authenticate API requests to GitHub.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <HomeNav />
      
      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Commit Chronicles
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Visualize your repository's history and uncover insights with beautiful analytics
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/explore">
              <Button size="lg" className="group">
                Get Insights 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="group">
                Get Components
                <Code className="ml-2 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="w-full max-w-5xl mt-12 animate-fade-in-up glass-morphism rounded-xl p-8 shadow-xl" style={{ animationDelay: '0.3s' }}>
            <img 
              src="/placeholder.svg" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-lg border border-white/10"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover everything Commit Chronicles can do to help you understand your repository better
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={0.1 * index}
            />
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="container px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about Commit Chronicles
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              delay={0.1 * index}
            />
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container px-4 py-12 mx-auto max-w-7xl border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <GitBranch className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-xl font-bold">Commit Chronicles</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-blue-400 transition-colors">Explorer</Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
          
          <div className="mt-6 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Commit Chronicles. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
