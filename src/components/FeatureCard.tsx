
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <div 
      className="glass-morphism rounded-xl p-6 animate-fade-in-up hover:translate-y-[-5px] transition-transform duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
