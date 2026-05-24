import { NavLink } from 'react-router-dom';
import { CoinCounter } from './CoinCounter';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: '🏠' },
  { label: 'Goals', path: '/goals', icon: '🎯' },
  { label: 'Daily Log', path: '/daily-log', icon: '📝' },
  { label: 'Templates', path: '/templates', icon: '📋' },
  { label: 'Rewards', path: '/rewards', icon: '🏆' },
  { label: 'Analytics', path: '/analytics', icon: '📊' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

interface SidebarProps {
  totalCoins: number;
}

export const Sidebar = ({ totalCoins }: SidebarProps) => {
  return (
    <aside className="w-60 min-h-screen bg-cozy-card border-r border-cozy-border flex flex-col">
      <div className="p-6 border-b border-cozy-border">
        <h1 className="text-lg font-bold text-cozy-text-primary">Premium Duck</h1>
        <p className="text-xs text-cozy-text-secondary">🦆</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, path, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cozy-yellow text-cozy-bg'
                      : 'text-cozy-text-secondary hover:text-cozy-text-primary hover:bg-cozy-hover'
                  }`
                }
              >
                <span>{icon}</span>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-cozy-border">
        <CoinCounter coins={totalCoins} />
      </div>
    </aside>
  );
};
