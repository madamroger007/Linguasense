import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { useTheme } from 'next-themes';

export default function Settings() {
  const { theme, setTheme } = useTheme();

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
                  <span className="text-sm text-muted-foreground">16px</span>
                </div>
                <Slider defaultValue={[16]} min={12} max={24} step={1} />
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
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-play Audio</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically play pronunciation
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Translations</p>
                  <p className="text-sm text-muted-foreground">
                    Display word translations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card className="p-6">
            <h3 className="text-xl mb-4">Account</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <div>
                <p className="font-medium">Learning Streak</p>
                <p className="text-sm text-muted-foreground">7 days</p>
              </div>
              <div>
                <p className="font-medium">Total Practice Time</p>
                <p className="text-sm text-muted-foreground">12 hours 45 minutes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
