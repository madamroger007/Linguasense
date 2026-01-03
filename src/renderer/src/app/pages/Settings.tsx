import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useSettings } from '../state/SettingsContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const {
    fontSize,
    setFontSize,
    dailyReminders,
    setDailyReminders,
    autoRun,
    setAutoRun,
    aiModel,
    setAiModel,
  } = useSettings();

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <h3 className="text-xl mb-4">Appearance</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? 'dark' : 'light')
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Font Size</p>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm mb-2 font-medium">Preview</p>
                <p className="text-muted-foreground">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </Card>

          {/* Learning Preferences */}
          <Card className="p-6">
            <h3 className="text-xl mb-4">Learning Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified to practice
                  </p>
                </div>
                <Switch
                  checked={dailyReminders}
                  onCheckedChange={setDailyReminders}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Run App</p>
                  <p className="text-sm text-muted-foreground">
                    Start learning session on app launch
                  </p>
                </div>
                <Switch
                  checked={autoRun}
                  onCheckedChange={setAutoRun}
                />
              </div>


            </div>
          </Card>

          {/* AI Model Selection */}
          <Card className="p-6">
            <h3 className="text-xl mb-4">AI Model</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select AI Model
                </label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lmstudio">LM Studio</SelectItem>
                    <SelectItem value="ollama">Ollama</SelectItem>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="ollama-cloud">Ollama Cloud</SelectItem>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Choose your preferred AI assistant for language tutoring
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
