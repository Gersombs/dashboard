import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache, fetchTopCoins } from './api';

const ORIGINAL_FETCH = global.fetch;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const SAMPLE_MARKET_DATA = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 50000,
    market_cap: 1000000000,
    market_cap_rank: 1,
    total_volume: 20000000,
    price_change_percentage_24h: 1.2,
    price_change_percentage_7d_in_currency: 3.4,
    sparkline_in_7d: { price: [1, 2, 3] },
    high_24h: 51000,
    low_24h: 49000,
    circulating_supply: 19000000,
    ath: 69000,
    ath_change_percentage: -27.5,
  },
];

describe('servicio api', () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
    vi.useRealTimers();
  });

  it('usa cache en memoria para evitar solicitudes duplicadas', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(SAMPLE_MARKET_DATA));

    global.fetch = fetchMock;

    const first = await fetchTopCoins('usd', 1);
    const second = await fetchTopCoins('usd', 1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toEqual(SAMPLE_MARKET_DATA);
    expect(second).toEqual(SAMPLE_MARKET_DATA);
  });

  it('reintenta errores transitorios del servidor y luego responde bien', async () => {
    vi.useFakeTimers();

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('temporary error', { status: 503 }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_MARKET_DATA));

    global.fetch = fetchMock;

    const request = fetchTopCoins('usd', 1);
    await vi.runAllTimersAsync();

    await expect(request).resolves.toEqual(SAMPLE_MARKET_DATA);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('no reintenta errores HTTP no reintentables', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('not found', { status: 404 }));

    global.fetch = fetchMock;

    await expect(fetchTopCoins('usd', 1)).rejects.toThrow('HTTP 404');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('devuelve mensaje amigable cuando se agotan reintentos por timeout', async () => {
    vi.useFakeTimers();

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new DOMException('aborted', 'AbortError'));

    global.fetch = fetchMock;

    const request = expect(fetchTopCoins('usd', 1)).rejects.toThrow(
      'tiempo limite'
    );
    await vi.runAllTimersAsync();

    await request;
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
