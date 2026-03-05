/**
 * MarketCapBarChart component displaying market capitalization comparison
 * for top cryptocurrencies using a horizontal bar chart.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CoinMarketData } from '@/lib/api';
import { formatCurrency, CHART_COLORS } from '@/lib/utils-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketCapBarChartProps {
  coins: CoinMarketData[];
  currency: string;
  isLoading: boolean;
}

/**
 * Custom tooltip for the bar chart
 */
function CustomTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { name: string; symbol: string; market_cap: number; volume: number };
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
        Capitalizacion:{' '}
        <span className="text-white font-medium">
          {formatCurrency(item.market_cap, currency, true)}
        </span>
      </p>
      <p className="text-xs text-slate-300">
        Volumen:{' '}
        <span className="text-white font-medium">
          {formatCurrency(item.volume, currency, true)}
        </span>
      </p>
    </div>
  );
}

export default function MarketCapBarChart({
  coins,
  currency,
  isLoading,
}: MarketCapBarChartProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5"
        role="status"
        aria-label="Cargando grafica de capitalizacion"
      >
        <Skeleton className="h-5 w-48 bg-slate-700 mb-4" />
        <Skeleton className="h-[300px] w-full bg-slate-700/50 rounded-lg" />
      </div>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <div
        className="rounded-xl bg-[#1A1D2E]/80 border border-white/5 p-5 flex items-center justify-center h-[380px]"
        role="status"
        aria-live="polite"
      >
        <p className="text-slate-400">No hay datos de mercado disponibles</p>
      </div>
    );
  }

  const chartData = coins.slice(0, 10).map((coin) => ({
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    market_cap: coin.market_cap,
    volume: coin.total_volume,
    displayName: coin.symbol.toUpperCase(),
  }));

  const summaryText = `Comparacion de capitalizacion para ${chartData.length} monedas. Simbolo lider: ${chartData[0]?.symbol ?? 'N/D'}.`;

  return (
    <figure
      className="rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5 transition-all hover:border-indigo-500/20"
      aria-labelledby="market-cap-title"
      aria-describedby="market-cap-summary"
    >
      <h3
        id="market-cap-title"
        className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-cyan-400 rounded-full" />
        Comparacion de capitalizacion
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3154" />
          <XAxis
            dataKey="displayName"
            stroke="#94A3B8"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={{ stroke: '#2D3154' }}
          />
          <YAxis
            stroke="#94A3B8"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={{ stroke: '#2D3154' }}
            tickFormatter={(value) => formatCurrency(value, currency, true)}
            width={80}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            formatter={() => (
              <span className="text-slate-300 text-sm">Capitalizacion</span>
            )}
          />
          <Bar
            dataKey="market_cap"
            name="Capitalizacion"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <figcaption id="market-cap-summary" className="sr-only">
        {summaryText}
      </figcaption>
    </figure>
  );
}
