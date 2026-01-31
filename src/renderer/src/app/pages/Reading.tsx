import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

import { LANGUAGES } from '../../../../shared/utils/language';
import { useReadingArticle } from '../hooks/reading/useReadingArticle';

const readingLevels = [
  { level: 'Beginner', color: 'bg-green-500' },
  { level: 'Intermediate', color: 'bg-yellow-500' },
  { level: 'Advanced', color: 'bg-red-500' },
];

export default function Reading() {
  const {
    selectedLevel,
    speakingLanguage,
    micEnabled,
    textToRead,
    loadingArticle,

    setSelectedLevel,
    setSpeakingLanguage,
    setMicEnabled,

    generateNewArticle,
  } = useReadingArticle();

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Reading Practice</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {readingLevels.map(item => (
            <Card
              key={item.level}
              className={`p-4 cursor-pointer transition-all ${selectedLevel === item.level
                ? 'ring-2 ring-accent'
                : 'hover:shadow-md'
                }`}
              onClick={() => setSelectedLevel(item.level)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="font-medium">{item.level}</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
            <h3 className="text-xl">Daily Article</h3>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-base">Language</Label>
                <Select
                  value={speakingLanguage}
                  onValueChange={setSpeakingLanguage}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(({ id, label }) => (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label>AI Read</Label>
                <Switch checked={micEnabled} onCheckedChange={setMicEnabled} />
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none min-h-[120px]">
            {loadingArticle ? (
              <p className="opacity-60">Generating article...</p>
            ) : (
              <p className="leading-relaxed whitespace-pre-line">
                {textToRead || 'Click "New Article" to start reading.'}
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={generateNewArticle} disabled={loadingArticle}>
              Generate New Article
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
