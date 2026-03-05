/**
 * PriceLineChart component displaying price history over time.
 * Uses Recharts LineChart with tooltips, legend, and responsive container.
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PriceHistoryPoint } from '@/lib/api';
import { formatCurrency, CHART_COLORS } from '@/lib/utils-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceLineChartProps {
  data: Record<string, PriceHistoryPoint[]>;
  currency: string;
  isLoading: boolean;
}

/**
 * Custom tooltip for the line chart
 */
function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  currency: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="bg-[#1A1D2E] border border-indigo-500/30 rounded-lg p-3 shadow-xl"
      role="tooltip"
    >
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">
            {formatCurrency(entry.value, currency)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PriceLineChart({
  data,
  currency,
  isLoading,
}: PriceLineChartProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5"
        role="status"
        aria-label="Cargando grafica de precio"
      >
        <Skeleton className="h-5 w-40 bg-slate-700 mb-4" />
        <Skeleton className="h-[300px] w-full bg-slate-700/50 rounded-lg" />
      </div>
    );
  }

  const coinIds = Object.keys(data);
  if (coinIds.length === 0) {
    return (
      <div
        className="rounded-xl bg-[#1A1D2E]/80 border border-white/5 p-5 flex items-center justify-center h-[380px]"
        role="status"
        aria-live="polite"
      >
        <p className="text-slate-400">No hay datos de precio disponibles</p>
      </div>
    );
  }

  // Merge data points by date for multi-line chart
  const primaryCoin = coinIds[0];
  const mergedData = (data[primaryCoin] || []).map((point, index) => {
    const entry: Record<string, string | number> = {
      date: point.date,
      timestamp: point.timestamp,
    };
    coinIds.forEach((coinId) => {
      const coinData = data[coinId];
      if (coinData && coinData[index]) {
        entry[coinId] = coinData[index].price;
      }
    });
    return entry;
  });

  const summaryText = `Grafica de historial de precio con ${coinIds.length} series y ${mergedData.length} puntos por serie.`;

  return (
    <figure
      className="rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5 transition-all hover:border-indigo-500/20"
      aria-labelledby="price-history-title"
      aria-describedby="price-history-summary"
    >
      <h3
        id="price-history-title"
        className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-indigo-500 rounded-full" />
        Historial de Precio
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={mergedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3154" />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={{ stroke: '#2D3154' }}
            interval="preserveStartEnd"
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
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value: string) => (
              <span className="text-slate-300 capitalize text-sm">
                {value}
              </span>
            )}
          />
          {coinIds.map((coinId, index) => (
            <Line
              key={coinId}
              type="monotone"
              dataKey={coinId}
              name={coinId}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                stroke: CHART_COLORS[index % CHART_COLORS.length],
                strokeWidth: 2,
                fill: '#1A1D2E',
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <figcaption id="price-history-summary" className="sr-only">
        {summaryText}
      </figcaption>
    </figure>
  );
}
