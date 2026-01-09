import { Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

import { useSettings } from '../state/SettingsContext';
import { useRealtimeSpeaking } from '../hooks/speaking/useRealtimeSpeaking';

export default function Speaking() {
  const { speakingLanguage, setSpeakingLanguage } = useSettings();
  const { start, stop, listening, messages, loading } =
    useRealtimeSpeaking();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6">Speaking Practice</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MIC */}
        <Card className="p-6 flex flex-col items-center">
          <Select value={speakingLanguage} onValueChange={setSpeakingLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="mandarin">Chinese (Mandarin)</SelectItem>
              <SelectItem value="english-uk">English (British)</SelectItem>
              <SelectItem value="english-us">English (US)</SelectItem>
              <SelectItem value="indonesian">Indonesian</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="korean">Korean</SelectItem>
              <SelectItem value="arabic">Arabic</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="portuguese">Portuguese</SelectItem>
              <SelectItem value="dutch">Dutch</SelectItem>
              <SelectItem value="russian">Russian</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>

          <motion.button
            onClick={listening ? stop : start}
            className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all ${listening
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-accent text-accent-foreground hover:scale-105'
              }`}
            animate={listening ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: listening ? Infinity : 0, duration: 1.5 }}
          >
            {listening ? <MicOff className="w-12 h-12 md:w-16 md:h-16" /> : <Mic className="w-12 h-12 md:w-16 md:h-16" />}
          </motion.button>

          <p className="mt-6 text-center text-muted-foreground">
            {listening ? 'Listening…' : 'Click to speak'}
          </p>
        </Card>

        {/* CHAT */}
        <Card className="p-6 h-[400px] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="mb-3">
              <b>{m.role === 'ai' ? 'AI' : 'You'}:</b>
              <p className="whitespace-pre-line">{m.content}</p>
            </div>
          ))}

          {loading && <p className="opacity-60">AI thinking…</p>}
        </Card>
      </div>
    </div>
  );
}
