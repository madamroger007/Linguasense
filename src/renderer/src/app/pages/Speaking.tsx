import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { motion } from 'motion/react';

export default function Speaking() {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('english');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hello! Click the microphone button to start practicing.',
    },
  ]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate adding a new message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: 'Hello, how are you?',
          },
          {
            role: 'ai',
            content:
              "Great pronunciation! Your intonation was natural. Let's practice more complex sentences.",
          },
        ]);
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Speaking Practice</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Microphone Section */}
          <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] lg:min-h-[400px]">
            <div className="mb-6 w-full">
              <label className="block text-sm mb-2">Select Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <motion.button
              onClick={toggleRecording}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-accent text-accent-foreground hover:scale-105'
              }`}
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 md:w-16 md:h-16" />
              ) : (
                <Mic className="w-12 h-12 md:w-16 md:h-16" />
              )}
            </motion.button>

            <p className="mt-6 text-center text-muted-foreground">
              {isRecording ? 'Listening...' : 'Click to start speaking'}
            </p>
          </Card>

          {/* AI Chat Panel */}
          <Card className="p-6 flex flex-col h-[300px] lg:h-[400px]">
            <h3 className="text-lg mb-4">AI Feedback</h3>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'ai'
                      ? 'bg-accent/10 text-foreground'
                      : 'bg-secondary text-foreground ml-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
