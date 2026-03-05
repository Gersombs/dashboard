import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Filters, { type FilterState } from '@/components/dashboard/Filters';
import StatCards from '@/components/dashboard/StatCards';
import PriceLineChart from '@/components/dashboard/PriceLineChart';
import MarketCapBarChart from '@/components/dashboard/MarketCapBarChart';
import VolumeDonutChart from '@/components/dashboard/VolumeDonutChart';
import {
  fetchTopCoins,
  fetchPriceHistory,
  clearCache,
  type CoinMarketData,
  type PriceHistoryPoint,
} from '@/lib/api';

const HERO_BG =
  'https://mgx-backend-cdn.metadl.com/generate/images/1003084/2026-03-04/421086a8-a195-4af0-903c-3b9134fb5656.png';

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({
    selectedCoin: 'bitcoin',
    dateRange: '30',
    currency: 'usd',
    topN: 10,
  });

  const {
    data: topCoins,
    isLoading: isLoadingCoins,
    isFetching: isFetchingCoins,
    error: coinsError,
    refetch: refetchCoins,
    dataUpdatedAt: topCoinsUpdatedAt,
  } = useQuery<CoinMarketData[]>({
    queryKey: ['topCoins', filters.currency, filters.topN],
    queryFn: () => fetchTopCoins(filters.currency, filters.topN),
    staleTime: 180_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: priceHistory,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    error: historyError,
    refetch: refetchHistory,
    dataUpdatedAt: historyUpdatedAt,
  } = useQuery<PriceHistoryPoint[]>({
    queryKey: [
      'priceHistory',
      filters.selectedCoin,
      filters.currency,
      filters.dateRange,
    ],
    queryFn: () =>
      fetchPriceHistory(
        filters.selectedCoin,
        filters.currency,
        parseInt(filters.dateRange, 10)
      ),
    staleTime: 180_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const selectedCoinData = useMemo(() => {
    if (!topCoins) return null;
    return topCoins.find((c) => c.id === filters.selectedCoin) || null;
  }, [topCoins, filters.selectedCoin]);

  const priceChartData = useMemo(() => {
    if (!priceHistory) return {};
    return { [filters.selectedCoin]: priceHistory };
  }, [priceHistory, filters.selectedCoin]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(async () => {
    clearCache();
    await Promise.all([refetchCoins(), refetchHistory()]);
  }, [refetchCoins, refetchHistory]);

  const error = coinsError || historyError;
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Error inesperado al cargar el dashboard.';
  const isRateLimitError = /rate limit|limite de solicitudes|429/i.test(
    errorMessage
  );
  const isSaturationError =
    /tiempo limite|timeout|error de red|503|504|no esta disponible|respondiendo muy lento|saturad/i.test(
      errorMessage
    );

  const isRefreshing = isFetchingCoins || isFetchingHistory;
  const hasLoadedData = Boolean(topCoins || priceHistory);
  const lastUpdatedTimestamp = Math.max(topCoinsUpdatedAt, historyUpdatedAt);
  const lastUpdatedLabel =
    hasLoadedData && lastUpdatedTimestamp > 0
      ? new Date(lastUpdatedTimestamp).toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : null;

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Ir al contenido principal
      </a>

      <header
        className="relative overflow-hidden border-b border-white/5"
        role="banner"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1117]/60 to-[#0F1117]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <TrendingUp
                  className="w-6 h-6 text-indigo-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Dashboard Cripto
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Prueba técnica - GersomBS
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-transparent border-[#2D3154] text-slate-300 hover:bg-[#242842] hover:text-white"
              aria-label="Actualizar datos del dashboard"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Actualizar
            </Button>
          </div>

          <p
            className="mt-3 text-xs text-slate-400"
            role="status"
            aria-live="polite"
          >
            {isRefreshing
              ? 'Actualizando datos de mercado...'
              : lastUpdatedLabel
              ? `Ultima actualizacion: ${lastUpdatedLabel}`
              : 'Cargando datos iniciales...'}
          </p>
        </div>
      </header>

      <main
        id="dashboard-main"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
        role="main"
        aria-label="Dashboard de criptomonedas"
        aria-busy={isLoadingCoins || isLoadingHistory}
      >
        {error && (
          <Alert
            variant="destructive"
            className="bg-red-500/10 border-red-500/30 text-red-300"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isRateLimitError
                ? 'Limite de API alcanzado'
                : isSaturationError
                  ? 'Servicio saturado'
                  : 'Error al cargar datos'}
            </AlertTitle>
            <AlertDescription>
              {isRateLimitError
                ? 'CoinGecko (plan gratis) permite pocas consultas por minuto. Espera unos segundos y presiona Actualizar.'
                : isSaturationError
                  ? 'La API gratis esta saturada o lenta. Ya aplicamos reintentos automaticos con backoff; intenta de nuevo en unos segundos.'
                  : errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <section aria-label="Filtros del dashboard">
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </section>

        <section aria-label="Estadisticas principales">
          <StatCards
            coin={selectedCoinData}
            currency={filters.currency}
            isLoading={isLoadingCoins}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="lg:col-span-2" aria-label="Grafica de historial de precio">
            <PriceLineChart
              data={priceChartData}
              currency={filters.currency}
              isLoading={isLoadingHistory}
            />
          </section>

          <section aria-label="Comparacion de capitalizacion de mercado">
            <MarketCapBarChart
              coins={topCoins || []}
              currency={filters.currency}
              isLoading={isLoadingCoins}
            />
          </section>

          <section aria-label="Distribucion de volumen de trading">
            <VolumeDonutChart
              coins={topCoins || []}
              currency={filters.currency}
              isLoading={isLoadingCoins}
            />
          </section>
        </div>

        <footer
          className="text-center py-6 border-t border-white/5"
          role="contentinfo"
        >
          <p className="text-xs text-slate-500">
            Datos provistos por{' '}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              CoinGecko API
            </a>{' '}
            | Dashboard creada con React, Recharts y shadcn/ui por GersomBS
          </p>
        </footer>
      </main>
    </div>
  );
}
