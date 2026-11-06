import { getDefaultNormalizer, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BatterySim } from '@/pages/BatterySim'
import { runSimulation } from '@/sim/client'
import type { SimResult } from '@/sim/sim'

vi.mock('@/sim/client', () => ({ runSimulation: vi.fn() }))
const run = vi.mocked(runSimulation)

const result: SimResult = {
  time: Float64Array.from([1, 2, 3]),
  voltage: Float64Array.from([4.1, 4.0, 3.9]),
  temperatureK: Float64Array.from([298, 298.1, 298.2]),
  crate: Float64Array.from([1, 1, 1]),
  soc: Float64Array.from([0.9, 0.5, 0.05]),
  stop: 'soc',
}

const page = () =>
  render(
    <MemoryRouter initialEntries={['/battery-sim']}>
      <BatterySim />
    </MemoryRouter>,
  )

// No beforeEach mockReset/mockClear: in vitest 3.2.3 a reset spy reports a later awaited rejection as a test error.
// Only 'runs once at a time' and the error test call run, in that order, so call counts stay exact.

// the default normalizer turns U+2009 into a plain space before comparing
const keepThinSpaces = { normalizer: getDefaultNormalizer({ collapseWhitespace: false }) }
const TEMP_MSG = 'Temperature must be 253\u2009–\u2009318 K.'

test('shows the C-rate input only in constant-current mode', async () => {
  page()
  expect(screen.getByLabelText('C-rate')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('radio', { name: 'Driving cycle' }))
  expect(screen.queryByLabelText('C-rate')).not.toBeInTheDocument()
  expect(screen.getByRole('combobox', { name: 'Driving cycle' })).toBeInTheDocument()
  expect(screen.getByText('Starts at 100% SOC and plays the cycle once.')).toBeInTheDocument()
})

test('rejects out-of-range input without running', async () => {
  page()
  const temp = screen.getByLabelText('Temperature [K]')
  await userEvent.clear(temp)
  await userEvent.type(temp, '400')
  await userEvent.click(screen.getByRole('button', { name: 'Run' }))
  expect(screen.getByText(TEMP_MSG, keepThinSpaces)).toBeInTheDocument()
  await userEvent.clear(temp)
  await userEvent.click(screen.getByRole('button', { name: 'Run' }))
  expect(screen.getByText(TEMP_MSG, keepThinSpaces)).toBeInTheDocument()
  expect(run).not.toHaveBeenCalled()
})

test('runs once at a time and then draws four charts', async () => {
  let resolve: (r: SimResult) => void = () => {}
  run.mockReturnValue(new Promise<SimResult>((r) => (resolve = r)))
  page()
  const button = screen.getByRole('button', { name: 'Run' })
  await userEvent.click(button)
  await userEvent.click(button)
  expect(run).toHaveBeenCalledTimes(1)
  expect(run).toHaveBeenCalledWith({ mode: 'cc', tempK: 298, crate: 1 })
  expect(button).toBeDisabled()
  expect(screen.getByText('Running…')).toBeInTheDocument()
  resolve(result)
  expect(await screen.findByText('Stopped at 5% SOC.')).toBeInTheDocument()
  const names = screen.getAllByRole('img').map((e) => e.getAttribute('aria-label'))
  expect(names).toEqual(['Terminal voltage', 'Cell temperature', 'C-rate', 'Discharge Capacity per Unit Area'])
  expect(button).toBeEnabled()
})

test('shows the engine error and allows another run', async () => {
  run.mockImplementation(async () => {
    throw new Error('SOLVE_T produced an invalid cell temperature')
  })
  page()
  await userEvent.click(screen.getByRole('button', { name: 'Run' }))
  expect(await screen.findByText('SOLVE_T produced an invalid cell temperature')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
})

test('cites the parameter source and uses no em dash', () => {
  page()
  expect(screen.getByRole('link', { name: /10\.1016\/j\.jpowsour\.2026\.241369/ })).toHaveAttribute(
    'href',
    'https://doi.org/10.1016/j.jpowsour.2026.241369',
  )
  expect(document.body.textContent).not.toContain('—')
  expect(screen.getByRole('link', { name: 'Battery Sim' })).toHaveAttribute('aria-current', 'page')
})

test('CC charge sends a charge run and reports the 4.2 V stop', async () => {
  run.mockResolvedValue({ ...result, crate: Float64Array.from([-1, -1, -1]), stop: 'voltage' })
  page()
  await userEvent.click(screen.getByRole('radio', { name: 'Constant current (charge)' }))
  expect(screen.getByText('Charge from (0.05, 0.95) stoichiometry, 0.2\u2009–\u20093 C', keepThinSpaces)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Run' }))
  expect(run).toHaveBeenLastCalledWith({ mode: 'charge', tempK: 298, crate: 1 })
  expect(await screen.findByText('Stopped at the 4.2 V cutoff.')).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Charge Capacity per Unit Area' })).toBeInTheDocument()
})
