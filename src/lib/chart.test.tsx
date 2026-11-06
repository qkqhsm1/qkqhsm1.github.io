import { render, screen } from '@testing-library/react'
import { LineChart } from '@/components/LineChart'
import { downsampleMinMax, niceTicks, yDomain } from '@/lib/chart'

test('min-max downsampling keeps the spikes and bounds the point count', () => {
  const n = 17100, x = new Float64Array(n).map((_, i) => i + 1), y = new Float64Array(n).fill(1)
  y[5000] = 8.1; y[9000] = -4.49
  const d = downsampleMinMax(x, y, 400)
  expect(d.x.length).toBeLessThanOrEqual(802)
  expect(Math.max(...d.y)).toBe(8.1); expect(Math.min(...d.y)).toBe(-4.49)
  expect(d.x[0]).toBe(1); expect(d.x.at(-1)).toBe(n)
})
test('a flat series gets a non-zero, finite domain', () => {
  const [lo, hi] = yDomain(new Float64Array(100).fill(1))
  expect(hi - lo).toBeGreaterThan(0); expect(Number.isFinite(lo) && Number.isFinite(hi)).toBe(true)
})
test('ticks are round, ascending, and inside the range', () => {
  const t = niceTicks(2.7, 4.25, 5)
  expect(t.length).toBeGreaterThanOrEqual(3)
  expect(t.every((v, i) => v >= 2.7 && v <= 4.25 && (i === 0 || v > t[i - 1]))).toBe(true)
})
test('a flat series draws a finite line across the full width', () => {
  const x = new Float64Array(10).map((_, i) => i + 1)
  render(<LineChart title="Voltage" unit="V" x={x} y={new Float64Array(10).fill(1)} />)
  const svg = screen.getByRole('img', { name: 'Voltage' })
  expect(svg).toHaveAttribute('width', '100%')
  const points = svg.querySelector('polyline')?.getAttribute('points') ?? ''
  expect(points).not.toBe('')
  expect(points).not.toContain('NaN')
})
