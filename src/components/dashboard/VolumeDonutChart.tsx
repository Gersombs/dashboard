/**
 * VolumeDonutChart component displaying trading volume distribution
 * among top cryptocurrencies using a pie/donut chart.
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CoinMarketData } from '@/lib/api';
import { formatCurrency, CHART_COLORS } from '@/lib/utils-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface VolumeDonutChartProps {
  coins: CoinMarketData[];
  currency: string;
  isLoading: boolean;
}

/**
 * Custom tooltip for the donut chart
 */
function CustomTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: { name: string; symbol: string; volume: number; percentage: number };
  }>;
  currency: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;
  return (
    <div
      className="bg-[#1A1D2E] border border-indigo-500/30 rounded-lg p-3 shadow-xl"
      role="tooltip"
    >
      <p className="text-sm font-semibold text-white mb-1">
        {item.name}{' '}
        <span className="text-slate-400 text-xs">({item.symbol})</span>
      </p>
      <p className="text-xs text-slate-300">
        Volume:{' '}
        <span className="text-white font-medium">
          {formatCurrency(item.volume, currency, true)}
        </span>
      </p>
      <p className="text-xs text-slate-300">
        Share:{' '}
        <span className="text-white font-medium">
          {item.percentage.toFixed(1)}%
        </span>
      </p>
    </div>
  );
}

/**
 * Custom legend renderer
 */
function renderLegend(props: {
  payload?: Array<{ value: string; color: string }>;
}) {
  const { payload } = props;
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function VolumeDonutChart({
  coins,
  currency,
  isLoading,
}: VolumeDonutChartProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5"
        role="status"
        aria-label="Loading volume chart"
      >
        <Skeleton className="h-5 w-44 bg-slate-700 mb-4" />
        <div className="flex justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full bg-slate-700/50" />
        </div>
      </div>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <div className="rounded-xl bg-[#1A1D2E]/80 border border-white/5 p-5 flex items-center justify-center h-[380px]">
        <p className="text-slate-400">No volume data available</p>
      </div>
    );
  }

  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);

  const chartData = coins.slice(0, 8).map((coin) => ({
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    volume: coin.total_volume,
    percentage: (coin.total_volume / totalVolume) * 100,
  }));

  // Add "Others" if there are more coins
  if (coins.length > 8) {
    const othersVolume = coins
      .slice(8)
      .reduce((sum, coin) => sum + coin.total_volume, 0);
    chartData.push({
      name: 'Others',
      symbol: 'OTHER',
      volume: othersVolume,
      percentage: (othersVolume / totalVolume) * 100,
    });
  }

  return (
    <div
      className="rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5 transition-all hover:border-indigo-500/20"
      role="figure"
      aria-label="Trading volume distribution donut chart"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-amber-400 rounded-full" />
        Volume Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="volume"
            nameKey="name"
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.9}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}