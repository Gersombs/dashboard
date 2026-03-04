/**
 * CoinGecko API service layer.
 * Handles all API requests with error handling, rate limiting awareness,
 * and data transformation for the crypto dashboard.
 *
 * API: CoinGecko Free API (no API key required)
 * Base URL: https://api.coingecko.com/api/v3
 * Rate Limit: ~10-30 calls/minute on free tier
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';

/** Cache to reduce API calls */
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 60_000; // 1 minute cache

/**
 * Generic fetch wrapper with error handling and caching
 */
async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        'Rate limit exceeded. Please wait a moment and try again.'
      );
    }
    if (response.status >= 500) {
      throw new Error(
        'CoinGecko server is temporarily unavailable. Please try again later.'
      );
    }
    throw new Error(`Failed to fetch data (HTTP ${response.status})`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

/** Market data for a single coin */
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: { price: number[] };
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  ath: number;
  ath_change_percentage: number;
}

/** Price history data point */
export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
  date: string;
}

/** Market chart raw response */
interface MarketChartResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Fetch top coins by market cap
 * @param currency - vs_currency (usd, eur, gbp)
 * @param perPage - Number of coins to fetch (max 250)
 */
export async function fetchTopCoins(
  currency: string = 'usd',
  perPage: number = 10
): Promise<CoinMarketData[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`;
  return fetchWithCache<CoinMarketData[]>(url);
}

/**
 * Fetch price history for a specific coin
 * @param coinId - CoinGecko coin ID
 * @param currency - vs_currency
 * @param days - Number of days of history
 */
export async function fetchPriceHistory(
  coinId: string,
  currency: string = 'usd',
  days: number = 30
): Promise<PriceHistoryPoint[]> {
  const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
  const data = await fetchWithCache<MarketChartResponse>(url);

  return data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));
}

/**
 * Fetch price history for multiple coins (for comparison)
 * @param coinIds - Array of CoinGecko coin IDs
 * @param currency - vs_currency
 * @param days - Number of days
 */
export async function fetchMultiplePriceHistory(
  coinIds: string[],
  currency: string = 'usd',
  days: number = 30
): Promise<Record<string, PriceHistoryPoint[]>> {
  const results: Record<string, PriceHistoryPoint[]> = {};

  // Fetch sequentially to avoid rate limiting
  for (const coinId of coinIds) {
    try {
      results[coinId] = await fetchPriceHistory(coinId, currency, days);
    } catch (error) {
      console.error(`Failed to fetch history for ${coinId}:`, error);
      results[coinId] = [];
    }
    // Small delay between requests to respect rate limits
    if (coinIds.indexOf(coinId) < coinIds.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return results;
}

/**
 * Clear the API cache (useful when user changes filters)
 */
export function clearCache(): void {
  cache.clear();
}