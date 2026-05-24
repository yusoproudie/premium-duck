import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  totalCoins: number;
}

export const MainLayout = ({ children, totalCoins }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-cozy-bg">
      <Sidebar totalCoins={totalCoins} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};
