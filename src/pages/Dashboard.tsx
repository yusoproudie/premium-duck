import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { QuickAdd } from '../components/dashboard/QuickAdd';
import { GrowthRadarChart } from '../components/dashboard/RadarChart';
import type { RadarDataPoint } from '../types';

const RADAR_DATA: RadarDataPoint[] = [
  { category: 'Work & Career', score: 0, fullMark: 10 },
  { category: 'Skills & Learning', score: 0, fullMark: 10 },
  { category: 'Health & Wellness', score: 0, fullMark: 10 },
  { category: 'Communication', score: 0, fullMark: 10 },
  { category: 'Finance', score: 0, fullMark: 10 },
  { category: 'Relationships', score: 0, fullMark: 10 },
];

const Dashboard = () => {
  const [totalCoins, setTotalCoins] = useState(0);

  const handleAddTask = (_description: string, coins: number) => {
    setTotalCoins((prev) => prev + coins);
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Today's snapshot" />

      {/* Stats cards — SR-18 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total coins" value={totalCoins} variant="primary" />
        <StatsCard label="HEAD" value="0.0" maxValue={10} />
        <StatsCard label="BODY" value="0.0" maxValue={10} />
        <StatsCard label="FEET" value="0.0" maxValue={10} />
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <GrowthRadarChart data={RADAR_DATA} />
        </div>
        <div>
          <QuickAdd onAddTask={handleAddTask} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
