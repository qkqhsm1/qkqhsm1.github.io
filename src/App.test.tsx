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

test('gallery page sits after Research in the menu and shows an empty state', () => {
  at('/gallery')
  expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('aria-current', 'page')
  const names = screen.getAllByRole('link').map((l) => l.textContent)
  expect(names.indexOf('Gallery')).toBe(names.indexOf('Research') + 1)
  expect(screen.getAllByText(/Photos coming soon/)).toHaveLength(2) // 2026 and 2025 are still empty
})

test('gallery is grouped by year, newest first', () => {
  at('/gallery')
  const years = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(years).toEqual(['2026', '2025', '2024'])
})

test('2024 shows the KSAE spring conference album with its photo', () => {
  at('/gallery')
  expect(screen.getByRole('heading', { level: 3, name: '2024 KSAE Spring Conference' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: /KSAE Spring Conference/ })).toHaveAttribute('src', '/gallery/2024-06-ksae-spring/group.jpg')
})

test('2024 lists its November albums above the June one', () => {
  at('/gallery')
  const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
  expect(titles).toEqual(['Ansys Simulation World 2024', '2024 KSAE Autumn Conference', '2024 KSAE Spring Conference'])
})
