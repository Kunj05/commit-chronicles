
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Separator } from './ui/separator';

interface ComponentDemoProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

export const ComponentDemo: React.FC<ComponentDemoProps> = ({
  title,
  description,
  code,
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast('Code copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="glass-morphism rounded-xl overflow-hidden animate-fade-in-up">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="bg-background/20 rounded-lg p-6 mb-6">
          {children}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant={codeVisible ? "secondary" : "default"} 
            onClick={() => setCodeVisible(!codeVisible)}
            className="space-x-2"
          >
            {codeVisible ? 'Hide Code' : 'View Code'}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyCode}
            className="h-10 w-10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <Collapsible open={codeVisible}>
        <CollapsibleContent>
          <Separator className="border-white/5" />
          <div className="p-6 bg-black/50 overflow-x-auto">
            <pre className="text-sm font-mono text-white/90 whitespace-pre-wrap">
              {code}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
