/**
 * Main Dashboard Page - CoinGecko Crypto Dashboard
 *
 * This is the primary page that orchestrates all dashboard components:
 * - Filters for user interaction
 * - StatCards for key metrics
 * - PriceLineChart for price history
 * - MarketCapBarChart for market cap comparison
 * - VolumeDonutChart for volume distribution
 *
 * State management is handled via React hooks with useQuery for data fetching.
 */

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

const HERO_BG = 'https://mgx-backend-cdn.metadl.com/generate/images/1003084/2026-03-04/421086a8-a195-4af0-903c-3b9134fb5656.png';

export default function DashboardPage() {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    selectedCoin: 'bitcoin',
    dateRange: '30',
    currency: 'usd',
    topN: 10,
  });

  // Fetch top coins by market cap
  const {
    data: topCoins,
    isLoading: isLoadingCoins,
    error: coinsError,
    refetch: refetchCoins,
  } = useQuery<CoinMarketData[]>({
    queryKey: ['topCoins', filters.currency, filters.topN],
    queryFn: () => fetchTopCoins(filters.currency, filters.topN),
    staleTime: 60_000,
    retry: 2,
  });

  // Fetch price history for selected coin
  const {
    data: priceHistory,
    isLoading: isLoadingHistory,
    error: historyError,
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
        parseInt(filters.dateRange)
      ),
    staleTime: 60_000,
    retry: 2,
  });

  // Find the selected coin data from top coins
  const selectedCoinData = useMemo(() => {
    if (!topCoins) return null;
    return topCoins.find((c) => c.id === filters.selectedCoin) || null;
  }, [topCoins, filters.selectedCoin]);

  // Format price history for chart
  const priceChartData = useMemo(() => {
    if (!priceHistory) return {};
    return { [filters.selectedCoin]: priceHistory };
  }, [priceHistory, filters.selectedCoin]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    clearCache();
    refetchCoins();
  }, [refetchCoins]);

  // Combined error state
  const error = coinsError || historyError;

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Hero Header */}
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
                  Crypto Dashboard
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Real-time cryptocurrency market data powered by CoinGecko
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-transparent border-[#2D3154] text-slate-300 hover:bg-[#242842] hover:text-white"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
        role="main"
        aria-label="Cryptocurrency dashboard"
      >
        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="bg-red-500/10 border-red-500/30 text-red-300"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : 'An unexpected error occurred. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <section aria-label="Dashboard filters">
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </section>

        {/* Stat Cards */}
        <section aria-label="Key statistics">
          <StatCards
            coin={selectedCoinData}
            currency={filters.currency}
            isLoading={isLoadingCoins}
          />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Line Chart - Full width on mobile, half on desktop */}
          <section className="lg:col-span-2" aria-label="Price history chart">
            <PriceLineChart
              data={priceChartData}
              currency={filters.currency}
              isLoading={isLoadingHistory}
            />
          </section>

          {/* Market Cap Bar Chart */}
          <section aria-label="Market capitalization comparison">
            <MarketCapBarChart
              coins={topCoins || []}
              currency={filters.currency}
              isLoading={isLoadingCoins}
            />
          </section>

          {/* Volume Donut Chart */}
          <section aria-label="Trading volume distribution">
            <VolumeDonutChart
              coins={topCoins || []}
              currency={filters.currency}
              isLoading={isLoadingCoins}
            />
          </section>
        </div>

        {/* Footer */}
        <footer
          className="text-center py-6 border-t border-white/5"
          role="contentinfo"
        >
          <p className="text-xs text-slate-500">
            Data provided by{' '}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              CoinGecko API
            </a>{' '}
            · Dashboard built with React, Recharts & shadcn/ui
          </p>
        </footer>
      </main>
    </div>
  );
}