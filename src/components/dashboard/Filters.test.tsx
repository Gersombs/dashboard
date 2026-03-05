import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Filters, { FilterState } from './Filters'

const mockFilters: FilterState = {
  selectedCoin: 'bitcoin',
  dateRange: '7',
  currency: 'usd',
  topN: 10,
}

describe('Filters Component', () => {
  test('renders toolbar correctly', () => {
    render(<Filters filters={mockFilters} onFilterChange={vi.fn()} />)

    expect(
      screen.getByRole('toolbar', { name: /filtros del dashboard/i })
    ).toBeInTheDocument()
  })

  test('calls onFilterChange when topN changes', () => {
    const mockOnChange = vi.fn()

    render(
      <Filters filters={mockFilters} onFilterChange={mockOnChange} />
    )

    const button20 = screen.getByRole('button', {
      name: /mostrar top 20 monedas/i,
    })

    fireEvent.click(button20)

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockFilters,
      topN: 20,
    })
  })
})
