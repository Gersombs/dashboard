/**
 * StatCards component displaying key metrics for the selected cryptocurrency.
 * Shows current price, 24h change, market cap, and trading volume.
 */

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Coins } from 'lucide-react';
import type { CoinMarketData } from '@/lib/api';
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  getChangeColor,
} from '@/lib/utils-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardsProps {
  coin: CoinMarketData | null;
  currency: string;
  isLoading: boolean;
}

interface StatCardItemProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  changeValue?: number;
}

function StatCardItem({
  title,
  value,
  subtitle,
  icon,
  changeValue,
}: StatCardItemProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5 p-5 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 group"
      role="article"
      aria-label={`${title}: ${value}`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {changeValue !== undefined && (
            <div
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: getChangeColor(changeValue) }}
            >
              {changeValue >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{formatPercentage(changeValue)}</span>
            </div>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-[#1A1D2E]/80 border border-white/5 p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-3 w-20 bg-slate-700" />
          <Skeleton className="h-7 w-32 bg-slate-700" />
          <Skeleton className="h-4 w-16 bg-slate-700" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
      </div>
    </div>
  );
}

export default function StatCards({
  coin,
  currency,
  isLoading,
}: StatCardsProps) {
  if (isLoading || !coin) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Cargando estadisticas"
        role="status"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Estadísticas de criptomoneda"
    >
      <StatCardItem
        title="Precio actual"
        value={formatCurrency(coin.current_price, currency)}
        subtitle={`Puesto #${coin.market_cap_rank}`}
        icon={<DollarSign className="w-5 h-5" aria-hidden="true" />}
        changeValue={coin.price_change_percentage_24h}
      />
      <StatCardItem
        title="Capitalización"
        value={formatCurrency(coin.market_cap, currency, true)}
        subtitle="Capitalización total"
        icon={<BarChart3 className="w-5 h-5" aria-hidden="true" />}
      />
      <StatCardItem
        title="Volumen 24h"
        value={formatCurrency(coin.total_volume, currency, true)}
        subtitle="Volumen de trading en 24 horas"
        icon={<Activity className="w-5 h-5" aria-hidden="true" />}
      />
      <StatCardItem
        title="Oferta circulante"
        value={`${formatNumber(coin.circulating_supply)} ${coin.symbol.toUpperCase()}`}
        subtitle={`áximo histórico: ${formatCurrency(coin.ath, currency)}`}
        icon={<Coins className="w-5 h-5" aria-hidden="true" />}
      />
    </div>
  );
}
