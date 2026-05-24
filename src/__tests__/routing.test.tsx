import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AppRoutes } from '../App';

// render AppRoutes (ไม่ใช้ App ที่มี BrowserRouter) เพื่อหลีกเลี่ยง nested router
const renderWithRoute = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <MainLayout totalCoins={0}>
        <AppRoutes />
      </MainLayout>
    </MemoryRouter>
  );
};

describe('Routing', () => {
  // SR-16, SR-17
  it('renders Dashboard on "/"', () => {
    renderWithRoute('/');
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders Goals on "/goals"', () => {
    renderWithRoute('/goals');
    expect(screen.getByRole('heading', { name: 'Goals' })).toBeInTheDocument();
  });

  it('renders Daily Log on "/daily-log"', () => {
    renderWithRoute('/daily-log');
    expect(screen.getByRole('heading', { name: /daily log/i })).toBeInTheDocument();
  });

  it('renders Templates on "/templates"', () => {
    renderWithRoute('/templates');
    expect(screen.getByRole('heading', { name: /templates/i })).toBeInTheDocument();
  });

  it('renders Rewards on "/rewards"', () => {
    renderWithRoute('/rewards');
    expect(screen.getByRole('heading', { name: /rewards/i })).toBeInTheDocument();
  });

  it('renders Analytics on "/analytics"', () => {
    renderWithRoute('/analytics');
    expect(screen.getByRole('heading', { name: /analytics/i })).toBeInTheDocument();
  });

  it('renders Settings on "/settings"', () => {
    renderWithRoute('/settings');
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  });
});
