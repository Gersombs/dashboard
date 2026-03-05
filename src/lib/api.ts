const BASE_URL = 'https://api.coingecko.com/api/v3';

function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = toPositiveInt(import.meta.env.VITE_API_CACHE_MS, 180_000);
const REQUEST_TIMEOUT_MS = toPositiveInt(
  import.meta.env.VITE_API_TIMEOUT_MS,
  20_000
);
const MAX_RETRIES = Math.min(
  toPositiveInt(import.meta.env.VITE_API_MAX_RETRIES, 3),
  6
);
const BACKOFF_BASE_MS = toPositiveInt(
  import.meta.env.VITE_API_BACKOFF_BASE_MS,
  600
);
const BACKOFF_JITTER_MS = toPositiveInt(
  import.meta.env.VITE_API_BACKOFF_JITTER_MS,
  300
);
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBackoffDelay(attempt: number): number {
  return (
    BACKOFF_BASE_MS * 2 ** attempt + Math.floor(Math.random() * BACKOFF_JITTER_MS)
  );
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

async function fetchWithRetry(url: string): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) return response;

      const shouldRetry =
        RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RETRIES;
      if (!shouldRetry) return response;
    } catch (error) {
      clearTimeout(timeoutId);

      const shouldRetry =
        (isAbortError(error) || isNetworkError(error)) &&
        attempt < MAX_RETRIES;
      if (!shouldRetry) throw error;
    }

    await sleep(getBackoffDelay(attempt));
  }

  throw new Error('Fallo la solicitud despues de varios reintentos.');
}

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  let response: Response;
  try {
    response = await fetchWithRetry(url);
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(
        'La solicitud excedio el tiempo limite. La API gratis puede estar saturada. Intenta de nuevo en unos segundos.'
      );
    }

    if (isNetworkError(error)) {
      throw new Error(
        'Error de red: no fue posible conectar con CoinGecko. Verifica tu conexion e intenta de nuevo.'
      );
    }

    throw new Error('Error de red inesperado al cargar datos.');
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        'Limite de solicitudes excedido. Espera un momento e intenta de nuevo.'
      );
    }
    if (response.status === 408 || response.status === 504) {
      throw new Error(
        'CoinGecko esta respondiendo muy lento. Intenta de nuevo en unos segundos.'
      );
    }
    if (response.status >= 500) {
      throw new Error(
        'El servidor de CoinGecko no esta disponible temporalmente. Intenta mas tarde.'
      );
    }
    throw new Error(`No se pudieron obtener datos (HTTP ${response.status})`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Formato de respuesta inesperado de la API de CoinGecko.');
  }

  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

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

export async function fetchTopCoins(
  currency: string = 'usd',
  perPage: number = 10
): Promise<CoinMarketData[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`;
  return fetchWithCache<CoinMarketData[]>(url);
}

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
    date: new Date(timestamp).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
    }),
  }));
}

export async function fetchMultiplePriceHistory(
  coinIds: string[],
  currency: string = 'usd',
  days: number = 30
): Promise<Record<string, PriceHistoryPoint[]>> {
  const results: Record<string, PriceHistoryPoint[]> = {};

  // Proteccion para limite de solicitudes:
  const safeCoinIds = coinIds.length > 5 ? coinIds.slice(0, 5) : coinIds;

  for (const coinId of safeCoinIds) {
    try {
      results[coinId] = await fetchPriceHistory(coinId, currency, days);
    } catch (error) {
      console.error(`No se pudo cargar el historial de ${coinId}:`, error);
      results[coinId] = [];
    }

    if (safeCoinIds.indexOf(coinId) < safeCoinIds.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

export function clearCache(): void {
  cache.clear();
}
