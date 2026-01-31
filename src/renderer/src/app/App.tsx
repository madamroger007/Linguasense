import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { SettingsProvider } from './provider/SettingsProvider';
import { SpeakingProvider } from './provider/SpeakingProvider';
import {
  DesktopSidebar,
  TabletHeader,
  TabletNavigation,
  MobileBottomNav,
} from './components/Navigation';
import Home from './pages/Home';
import Speaking from './pages/Speaking';
import Reading from './pages/Reading';
import Writing from './pages/Writing';
import Settings from './pages/Settings';
import { GlobalErrorBanner } from './components/alert/error';
import { SystemProvider } from './provider/SystemProvider';
import { useSystemShortcuts } from './hooks/system/useSystemShortcuts';
import { SystemSpeechRuntime } from './hooks/system/SystemSpeechRuntime';


function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const fontSize = savedFontSize ? parseInt(savedFontSize) : 16;
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <TabletHeader />
      <TabletNavigation />
      <main className="lg:ml-64">
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}

function AppInner() {
  useSystemShortcuts();
  return (
    <>
      <SystemSpeechRuntime />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>

    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SystemProvider>
        <SpeakingProvider>
          <SettingsProvider>
            <HashRouter>
              <GlobalErrorBanner />
              <AppInner />
            </HashRouter>
          </SettingsProvider>
        </SpeakingProvider>
      </SystemProvider>
    </ThemeProvider>
  );
}
