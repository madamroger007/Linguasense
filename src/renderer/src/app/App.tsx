import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { SpeakingProvider } from './context/SpeakingContext';
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

function Layout({ children }: { children: React.ReactNode }) {
  // Initialize global font size from localStorage
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

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SpeakingProvider>
        <SettingsProvider>
          <HashRouter>
            <Layout>
              <GlobalErrorBanner />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/speaking" element={<Speaking />} />
                <Route path="/reading" element={<Reading />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </HashRouter>
        </SettingsProvider>
      </SpeakingProvider>
    </ThemeProvider>
  );
}
