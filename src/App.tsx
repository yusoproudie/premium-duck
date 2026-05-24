import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import DailyLog from './pages/DailyLog';
import Templates from './pages/Templates';
import Rewards from './pages/Rewards';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/goals" element={<Goals />} />
    <Route path="/daily-log" element={<DailyLog />} />
    <Route path="/templates" element={<Templates />} />
    <Route path="/rewards" element={<Rewards />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <MainLayout totalCoins={0}>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
