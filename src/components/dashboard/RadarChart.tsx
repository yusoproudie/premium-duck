import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { RadarDataPoint } from '../../types';

interface GrowthRadarChartProps {
  data: RadarDataPoint[];
}

export const GrowthRadarChart = ({ data }: GrowthRadarChartProps) => {
  return (
    <div className="bg-cozy-card rounded-xl p-5 border border-cozy-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-cozy-text-primary uppercase tracking-wider">
          Growth radar
        </h2>
        <span className="text-xs text-cozy-text-secondary">0–10 scale</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="#3a3a4a" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#8888aa', fontSize: 11 }}
          />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            stroke="#f5c842"
            fill="#f5c842"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
