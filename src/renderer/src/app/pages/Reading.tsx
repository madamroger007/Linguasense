import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';

const readingLevels = [
  { level: 'Beginner', color: 'bg-green-500' },
  { level: 'Intermediate', color: 'bg-yellow-500' },
  { level: 'Advanced', color: 'bg-red-500' },
];

const sampleText = `The sun rises in the east and sets in the west. Every morning, people around the world wake up to a new day filled with possibilities. Some enjoy their morning coffee while reading the news, while others prefer to start their day with exercise. Regardless of how we begin our day, each sunrise brings a fresh start and new opportunities to learn and grow.`;

export default function Reading() {
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');
  const [micEnabled, setMicEnabled] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Reading Practice</h1>

        {/* Reading Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {readingLevels.map((item) => (
            <Card
              key={item.level}
              className={`p-4 cursor-pointer transition-all ${
                selectedLevel === item.level
                  ? 'ring-2 ring-accent'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedLevel(item.level)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="font-medium">{item.level}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reading Text */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Daily Article</h3>
              <div className="flex items-center gap-2">
                <label className="text-sm">Mic</label>
                <Switch checked={micEnabled} onCheckedChange={setMicEnabled} />
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="leading-relaxed">{sampleText}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => setShowChat(!showChat)}>
                Ask AI Assistant
              </Button>
              <Button variant="outline">Next Article</Button>
            </div>
          </Card>

          {/* AI Chat / Vocabulary */}
          <Card className="p-6 h-fit lg:sticky lg:top-6">
            <h3 className="text-lg mb-4">
              {showChat ? 'AI Assistant' : 'Vocabulary'}
            </h3>
            {showChat ? (
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm">
                    I'm here to help! Ask me about any word or concept in the
                    text.
                  </p>
                </div>
                <textarea
                  className="w-full p-3 rounded-lg bg-secondary border-0 resize-none"
                  rows={3}
                  placeholder="Type your question..."
                ></textarea>
                <Button className="w-full">Send</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="font-medium">Possibilities</p>
                  <p className="text-sm text-muted-foreground">
                    /ˌpɒsəˈbɪlɪtiz/ - Things that may happen or be true
                  </p>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="font-medium">Opportunities</p>
                  <p className="text-sm text-muted-foreground">
                    /ˌɒpəˈtjuːnɪtiz/ - Favorable chances or occasions
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
