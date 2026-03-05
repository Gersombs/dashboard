import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AVAILABLE_COINS,
  DATE_RANGES,
  CURRENCIES,
} from '@/lib/utils-dashboard';

export interface FilterState {
  selectedCoin: string;
  dateRange: string;
  currency: string;
  topN: number;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleChange = (key: keyof FilterState, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-[#1A1D2E]/80 backdrop-blur-sm border border-white/5"
      role="toolbar"
      aria-label="Filtros del dashboard"
    >
      {/* Coin Selector */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="coin-select"
          className="text-xs text-slate-400 font-medium"
        >
          Criptomoneda
        </label>
        <Select
          value={filters.selectedCoin}
          onValueChange={(v) => handleChange('selectedCoin', v)}
        >
          <SelectTrigger
            id="coin-select"
            className="w-[180px] bg-[#242842] border-[#2D3154] text-slate-200 focus:ring-indigo-500"
            aria-label="Seleccionar criptomoneda"
          >
            <SelectValue placeholder="Selecciona moneda" />
          </SelectTrigger>
          <SelectContent className="bg-[#242842] border-[#2D3154]">
            {AVAILABLE_COINS.map((coin) => (
              <SelectItem
                key={coin.id}
                value={coin.id}
                className="text-slate-200 focus:bg-indigo-500/20 focus:text-white"
              >
                <span className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1 border-slate-600 text-slate-400"
                  >
                    {coin.symbol}
                  </Badge>
                  {coin.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="date-range"
          className="text-xs text-slate-400 font-medium"
        >
          Periodo
        </label>
        <Select
          value={filters.dateRange}
          onValueChange={(v) => handleChange('dateRange', v)}
        >
          <SelectTrigger
            id="date-range"
            className="w-[140px] bg-[#242842] border-[#2D3154] text-slate-200 focus:ring-indigo-500"
            aria-label="Seleccionar periodo"
          >
            <SelectValue placeholder="Rango de fechas" />
          </SelectTrigger>
          <SelectContent className="bg-[#242842] border-[#2D3154]">
            {DATE_RANGES.map((range) => (
              <SelectItem
                key={range.value}
                value={range.value}
                className="text-slate-200 focus:bg-indigo-500/20 focus:text-white"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Currency */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="currency-select"
          className="text-xs text-slate-400 font-medium"
        >
          Moneda
        </label>
        <Select
          value={filters.currency}
          onValueChange={(v) => handleChange('currency', v)}
        >
          <SelectTrigger
            id="currency-select"
            className="w-[130px] bg-[#242842] border-[#2D3154] text-slate-200 focus:ring-indigo-500"
            aria-label="Seleccionar moneda"
          >
            <SelectValue placeholder="Moneda" />
          </SelectTrigger>
          <SelectContent className="bg-[#242842] border-[#2D3154]">
            {CURRENCIES.map((curr) => (
              <SelectItem
                key={curr.value}
                value={curr.value}
                className="text-slate-200 focus:bg-indigo-500/20 focus:text-white"
              >
                {curr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Top N Coins */}
      <fieldset className="flex flex-col gap-1">
        <legend className="text-xs text-slate-400 font-medium">
          Mostrar top monedas
        </legend>
        <div className="flex gap-1" aria-label="Cantidad de monedas a mostrar">
          {[5, 10, 20].map((n) => (
            <Button
              key={n}
              variant={filters.topN === n ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('topN', n)}
              className={
                filters.topN === n
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                  : 'bg-transparent border-[#2D3154] text-slate-400 hover:bg-[#242842] hover:text-slate-200'
              }
              aria-pressed={filters.topN === n}
              aria-label={`Mostrar top ${n} monedas`}
            >
              {n}
            </Button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
