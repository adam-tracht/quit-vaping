import { Home, TrendingUp, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'progress' | 'settings';
  onViewChange: (view: 'dashboard' | 'progress' | 'settings') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, icon: Home, label: 'Home' },
    { id: 'progress' as const, icon: TrendingUp, label: 'Progress' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
      <div className="flex items-center justify-around py-2 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-primary' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
