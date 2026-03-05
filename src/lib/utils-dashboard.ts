export function formatCurrency(
  value: number,
  currency: string = 'usd',
  compact: boolean = false
): string {
  const symbols: Record<string, string> = {
    usd: '$',
    eur: '\u20AC',
    gbp: '\u00A3',
  };

  const symbol = symbols[currency.toLowerCase()] || '$';

  if (compact && Math.abs(value) >= 1e9) {
    return `${symbol}${(value / 1e9).toFixed(2)}B`;
  }
  if (compact && Math.abs(value) >= 1e6) {
    return `${symbol}${(value / 1e6).toFixed(2)}M`;
  }
  if (compact && Math.abs(value) >= 1e3) {
    return `${symbol}${(value / 1e3).toFixed(2)}K`;
  }

  if (value >= 1) {
    return `${symbol}${value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Para valores muy pequenos (altcoins).
  return `${symbol}${value.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`;
}

export function formatNumber(value: number): string {
  if (Math.abs(value) >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  }
  if (Math.abs(value) >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDate(
  timestamp: number,
  format: 'short' | 'long' = 'short'
): string {
  const date = new Date(timestamp);
  if (format === 'short') {
    return date.toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('es-MX', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getChangeColor(value: number): string {
  return value >= 0 ? '#10B981' : '#EF4444';
}

export const CHART_COLORS = [
  '#6366F1',
  '#22D3EE',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#84CC16',
];

export const AVAILABLE_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
] as const;

export const DATE_RANGES = [
  { value: '7', label: '7 dias' },
  { value: '30', label: '30 dias' },
  { value: '90', label: '90 dias' },
  { value: '365', label: '1 ano' },
] as const;

export const CURRENCIES = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (\u20AC)' },
  { value: 'gbp', label: 'GBP (\u00A3)' },
] as const;
