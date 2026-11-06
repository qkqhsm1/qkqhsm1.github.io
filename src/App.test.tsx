import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

const at = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

test('research page lists the three areas and marks its menu item', () => {
  at('/research')
  for (const t of ['Electrochemical Modeling', 'Electrochemical Simulation', 'Physics-based Parameter Identification']) {
    expect(screen.getByRole('heading', { name: t })).toBeInTheDocument()
  }
  expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'Battery Sim' })).not.toHaveAttribute('aria-current')
})

test('each research area has a figure beside its text', () => {
  at('/research')
  for (const name of ['Cell cross-section schematic', 'Simulated voltage and temperature schematic', 'Bayesian parameter identification schematic']) {
    expect(screen.getByRole('img', { name })).toBeInTheDocument()
  }
})

test('battery sim page has its page title', () => {
  at('/battery-sim')
  expect(screen.getByRole('heading', { name: 'Battery 1D Simulation (SPMe)' })).toBeInTheDocument()
})
