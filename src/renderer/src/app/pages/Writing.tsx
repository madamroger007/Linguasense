import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

export default function Writing() {
  const [sourceLanguage, setSourceLanguage] = useState('english');
  const [targetLanguage, setTargetLanguage] = useState('spanish');
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);

  const handleAnalyze = () => {
    setFeedback([
      '✓ Great use of vocabulary!',
      '⚠ Consider using "furthermore" instead of "also" for formal writing',
      '✓ Excellent sentence structure',
      '⚠ Minor grammar: "was" should be "were" in the second paragraph',
    ]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Writing Practice</h1>

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Source Language</label>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger>
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
          <div>
            <label className="block text-sm mb-2">Target Language</label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Writing Area */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg mb-4">Your Writing</h3>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing here..."
              className="min-h-[300px] md:min-h-[400px] resize-none"
            />
            <div className="mt-4 flex gap-3">
              <Button onClick={handleAnalyze}>Get AI Feedback</Button>
              <Button variant="outline">Clear</Button>
              <Button variant="outline">Save Draft</Button>
            </div>
          </Card>

          {/* AI Feedback */}
          <Card className="p-6 h-fit lg:sticky lg:top-6">
            <h3 className="text-lg mb-4">AI Suggestions</h3>
            {feedback.length > 0 ? (
              <div className="space-y-3">
                {feedback.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-secondary rounded-lg text-sm"
                  >
                    {item}
                  </div>
                ))}
                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="font-medium mb-2">Overall Score</p>
                  <div className="text-3xl font-semibold text-accent">85/100</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Good work! Focus on formal transitions.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Write something and click "Get AI Feedback" to receive
                suggestions.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
