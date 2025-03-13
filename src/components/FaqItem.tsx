
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  delay?: number;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, delay = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="glass-morphism rounded-xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <button
        className="w-full flex justify-between items-center p-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        {isOpen ? <ChevronUp className="ml-2 flex-shrink-0" /> : <ChevronDown className="ml-2 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 ">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
