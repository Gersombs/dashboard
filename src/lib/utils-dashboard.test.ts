import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  getChangeColor,
  CHART_COLORS,
  AVAILABLE_COINS,
  DATE_RANGES,
  CURRENCIES,
} from './utils-dashboard'

describe('formatCurrency', () => {
  it('formatea USD correctamente', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })

  it('formatea EUR correctamente', () => {
    expect(formatCurrency(1000, 'eur')).toBe('\u20AC1,000.00')
  })

  it('usa notacion compacta para millones', () => {
    expect(formatCurrency(1_500_000, 'usd', true)).toBe('$1.50M')
  })

  it('formatea valores pequenos con mas decimales', () => {
    expect(formatCurrency(0.000123)).toContain('$0.000123')
  })
})

describe('formatNumber', () => {
  it('formatea trillones', () => {
    expect(formatNumber(1_000_000_000_000)).toBe('1.00T')
  })

  it('formatea billones', () => {
    expect(formatNumber(1_000_000_000)).toBe('1.00B')
  })

  it('formatea millones', () => {
    expect(formatNumber(1_000_000)).toBe('1.00M')
  })

  it('formatea miles', () => {
    expect(formatNumber(1_000)).toBe('1.00K')
  })

  it('formatea numeros pequenos', () => {
    expect(formatNumber(10)).toBe('10.00')
  })
})

describe('formatPercentage', () => {
  it('agrega signo + para valores positivos', () => {
    expect(formatPercentage(5)).toBe('+5.00%')
  })

  it('formatea valores negativos correctamente', () => {
    expect(formatPercentage(-3.5)).toBe('-3.50%')
  })
})

describe('formatDate', () => {
  const timestamp = new Date('2024-01-01T12:00:00Z').getTime()

  it('formatea fecha corta', () => {
    expect(formatDate(timestamp, 'short')).toMatch(/ene|enero/i)
  })

  it('formatea fecha larga', () => {
    expect(formatDate(timestamp, 'long')).toMatch(/2024/)
  })
})

describe('getChangeColor', () => {
  it('regresa verde para valores positivos', () => {
    expect(getChangeColor(10)).toBe('#10B981')
  })

  it('regresa rojo para valores negativos', () => {
    expect(getChangeColor(-5)).toBe('#EF4444')
  })
})

describe('constantes', () => {
  it('CHART_COLORS tiene valores', () => {
    expect(CHART_COLORS.length).toBeGreaterThan(0)
  })

  it('AVAILABLE_COINS contiene bitcoin', () => {
    expect(AVAILABLE_COINS.some(c => c.id === 'bitcoin')).toBe(true)
  })

  it('DATE_RANGES contiene 30 dias', () => {
    expect(DATE_RANGES.some(r => r.value === '30')).toBe(true)
  })

  it('CURRENCIES contiene usd', () => {
    expect(CURRENCIES.some(c => c.value === 'usd')).toBe(true)
  })
})
