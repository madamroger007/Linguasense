import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <TabletHeader onToggleTheme={() => {}} />
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
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}
