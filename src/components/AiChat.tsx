import  { useState,useEffect } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';

export const AiChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial greeting and prompt message
    setMessages([
      'AI: Hello! I am here to help you understand commits, use the repository, and answer any questions you have about your project. How can I assist you today?'
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      setMessages([...messages, `You: ${userMessage}`]);
      setInput('');
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:3001/api/chat', {
          message: userMessage,
        });

        const aiMessage = response.data.message;
        setMessages((prevMessages) => [...prevMessages, `AI: ${aiMessage}`]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setMessages((prevMessages) => [...prevMessages, 'AI: Sorry, something went wrong.']);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 ">
      <div className="flex-1 overflow-y-auto  p-14 rounded shadow ">
        {messages.map((message, index) => (
          <div key={index} className="p-2 my-2 bg-blue-100 rounded">
            {message}
          </div>
        ))}
        {loading && <div className="p-2 my-2 bg-gray-100 rounded">AI is typing...</div>}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          className="flex-1 bg-background/95 border-white/10 mr-2 "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button
          className=""
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};