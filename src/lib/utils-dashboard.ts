/**
 * Dashboard utility functions for formatting currencies, numbers, dates,
 * and other data transformations used across the crypto dashboard.
 */

/**
 * Format a number as currency with appropriate symbol
 * @param value - The numeric value to format
 * @param currency - Currency code (usd, eur, gbp)
 * @param compact - Whether to use compact notation for large numbers
 */
export function formatCurrency(
  value: number,
  currency: string = 'usd',
  compact: boolean = false
): string {
  const symbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
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
    return `${symbol}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // For very small values (e.g., some altcoins)
  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`;
}

/**
 * Format a large number with compact notation
 * @param value - The numeric value
 */
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

/**
 * Format a percentage value with + or - sign
 * @param value - The percentage value
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a Unix timestamp to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - 'short' for MM/DD, 'long' for full date
 */
export function formatDate(
  timestamp: number,
  format: 'short' | 'long' = 'short'
): string {
  const date = new Date(timestamp);
  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get color based on positive/negative value
 * @param value - The numeric value
 */
export function getChangeColor(value: number): string {
  return value >= 0 ? '#10B981' : '#EF4444';
}

/**
 * Chart color palette for consistent styling
 */
export const CHART_COLORS = [
  '#6366F1', // Indigo
  '#22D3EE', // Cyan
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#84CC16', // Lime
];

/**
 * Available cryptocurrencies for the dashboard
 */
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
];

/**
 * Date range options for price history
 */
export const DATE_RANGES = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' },
  { value: '365', label: '1 Year' },
];

/**
 * Currency options
 */
export const CURRENCIES = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
];