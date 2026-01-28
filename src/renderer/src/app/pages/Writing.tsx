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
import { LANGUAGES } from '../../../../shared/utils/language';
import { useWriting } from '../hooks/writing/useWriting';

export default function Writing() {
  const {
    fromLanguage,
    toLanguage,
    setFromLanguage,
    setToLanguage,

    descriptionText,
    loadingDescription,
    generateDescription,

    userWriting,
    setUserWriting,
    clearWriting,

    feedback,
    loadingFeedback,
    analyzeWriting,
  } = useWriting();

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Writing Practice</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">From Language</label>
            <Select value={fromLanguage} onValueChange={setFromLanguage}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-2">To Language</label>
            <Select value={toLanguage} onValueChange={setToLanguage}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Description */}
          <Card className="w-full p-6 h-fit">
            <h3 className="text-lg mb-2">Translate Writing Language</h3>
            <div className="p-4 bg-accent/10 rounded-lg min-h-[140px]">
              {loadingDescription ? (
                <p className="opacity-60">Generating text...</p>
              ) : (
                <p className="text-justify whitespace-pre-line">
                  {descriptionText ||
                    'Click "Generate Text" to get a writing task.'}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Button onClick={generateDescription} disabled={loadingDescription}>
                Generate Text
              </Button>
            </div>
          </Card>

          {/* Writing Area */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg mb-4">Your Writing</h3>
            <Textarea
              value={userWriting}
              onChange={e => setUserWriting(e.target.value)}
              placeholder="Write your translation here..."
              className="min-h-[300px] resize-none"
            />
            <div className="mt-4 flex gap-3">
              <Button onClick={analyzeWriting} disabled={loadingFeedback}>
                Get AI Feedback
              </Button>
              <Button variant="outline" onClick={clearWriting}>
                Clear
              </Button>
            </div>
          </Card>

          {/* Feedback */}
          <Card className="p-6 h-fit">
            <h3 className="text-lg mb-4">AI Feedback</h3>

            {feedback ? (
              <div className="space-y-3">
                {feedback.suggestions.map((s, i) => (
                  <div key={i} className="p-3 bg-secondary rounded-lg text-sm">
                    {s}
                  </div>
                ))}

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="font-medium mb-2">Overall Score</p>
                  <div className="text-3xl font-semibold text-accent">
                    {feedback.score}/100
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {feedback.summary}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Write your translation and click “Get AI Feedback”.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
