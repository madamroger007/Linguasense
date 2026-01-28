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
import { Label } from '../components/ui/label';
import { useSettings } from '../context/SettingsContext';
import { useRealtimeSpeaking } from '../hooks/speaking/useRealtimeSpeaking';
import { useSpeaking } from '../context/SpeakingContext';
import { LANGUAGES } from '../../../../shared/utils/language';

export default function Speaking() {
  const { state, dispatch } = useSettings();
  const { start, stop, listening, messages } =
    useRealtimeSpeaking();
  const { store } = useSpeaking();
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Speaking Practice</h1>

        <div className="grid grid-cols-1  gap-6">

          <Card className="p-6 flex flex-col items-center">
            <div className='w-full'>
              <Label htmlFor="language-select" className='my-2 text-base'>Response Language</Label>
              <Select value={state.speakingLanguage} onValueChange={(value) => dispatch({ type: 'SET_SPEAKING_LANGUAGE', payload: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(({ id, label }) => (
                    <SelectItem key={id} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

            {store.loading && <p className="opacity-60">AI thinking…</p>}


          </Card>
        </div>
      </div>
    </div >
  );
}
