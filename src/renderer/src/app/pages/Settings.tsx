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
import { Input } from '../components/ui/input';
import { useSettings } from '../provider/SettingsProvider';
import { AI_CATALOG } from '../../../../shared/utils/aiCatalog';
import { AIProvider } from '../../../../shared/types/aiprovider';
import { LANGUAGES } from '../../../../shared/utils/language';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useSettings();

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
                  <span className="text-sm text-muted-foreground">{state.fontSize}px</span>
                </div>
                <Slider
                  value={[state.fontSize]}
                  onValueChange={(value) => dispatch({ type: 'SET_FONT_SIZE', payload: value[0] })}
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
                  checked={state.dailyReminders}
                  onCheckedChange={(value) => dispatch({ type: 'SET_DAILY_REMINDERS', payload: value })}
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
                  checked={state.autoRun}
                  onCheckedChange={(value) => dispatch({ type: 'SET_AUTO_RUN', payload: value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl mb-4">Translate Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select language
                </label>
                <Select value={state.translateLanguage} onValueChange={(value) => dispatch({ type: 'SET_TRANSLATE_LANGUAGE', payload: value })}>
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

                <p className="text-xs text-muted-foreground mt-2">
                  Choose your preferred AI assistant for language tutoring  <a className='text-blue-500' href={AI_CATALOG[state.aiProvider].docs} target="_blank" rel="noopener noreferrer">Documentation</a>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl mb-4">AI Model</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select AI Provider
                </label>
                <Select value={state.aiProvider} onValueChange={(value) => dispatch({ type: 'SET_AI_PROVIDER', payload: value as AIProvider })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AI_CATALOG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground mt-2">
                  Choose your preferred AI assistant for language tutoring  <a className='text-blue-500' href={AI_CATALOG[state.aiProvider].docs} target="_blank" rel="noopener noreferrer">Documentation</a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select AI Model
                </label>
                <Select value={state.aiModel} onValueChange={(value) => dispatch({ type: 'SET_AI_MODEL', payload: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_CATALOG[state.aiProvider].models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground mt-2">
                  Choose your preferred AI assistant for language tutoring
                </p>
              </div>
              {AI_CATALOG[state.aiProvider].requiresApiKey && (
                <div>
                  <Input
                    type="password"
                    value={state.apiKey}
                    onChange={(e) => dispatch({ type: 'SET_API_KEY', payload: e.target.value })}
                    placeholder="Enter API Key"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    API key required for {AI_CATALOG[state.aiProvider].label}
                  </p>
                </div>
              )}

              {AI_CATALOG[state.aiProvider].requiresUrl && (
                <div>
                  <Input
                    type="text"
                    value={state.url}
                    onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
                    placeholder="Example URL (http://127.0.0.1:1234/v1)"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    URL required for {AI_CATALOG[state.aiProvider].label}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
