import { NavLink } from 'react-router-dom';
import { Home, Mic, Book, PenTool, Settings } from 'lucide-react';
import { cn } from './ui/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/speaking', label: 'Speaking', icon: Mic },
  { path: '/reading', label: 'Reading', icon: Book },
  { path: '/writing', label: 'Writing', icon: PenTool },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <h1 className="text-xl font-semibold text-accent">LinguaSense</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/10 text-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function TabletHeader({ onToggleTheme }: { onToggleTheme: () => void }) {
  return (
    <header className="hidden md:flex lg:hidden items-center justify-between h-16 px-6 bg-card border-b border-border">
      <h1 className="text-xl font-semibold text-accent">LinguaSense</h1>
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-lg hover:bg-accent/10"
      >
        <Settings className="w-5 h-5" />
      </button>
    </header>
  );
}

export function TabletNavigation() {
  return (
    <nav className="hidden md:flex lg:hidden items-center justify-around h-14 bg-card border-b border-border">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              isActive
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-sm">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around h-16 bg-card border-t border-border">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 h-full transition-colors',
              isActive
                ? 'text-accent'
                : 'text-muted-foreground'
            )
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
