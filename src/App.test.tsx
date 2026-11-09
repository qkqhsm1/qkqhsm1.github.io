import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
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

test('gallery page sits after Research in the menu and has no empty years', () => {
  at('/gallery')
  expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('aria-current', 'page')
  const names = screen.getAllByRole('link').map((l) => l.textContent)
  expect(names.indexOf('Gallery')).toBe(names.indexOf('Research') + 1)
  expect(screen.queryByText(/Photos coming soon/)).not.toBeInTheDocument()
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

test('only the newest year with albums starts open, and each year shows its album count', () => {
  at('/gallery')
  const year = (name: string) => screen.getByRole('heading', { level: 2, name }).closest('details')
  expect(year('2026')).toHaveAttribute('open')
  expect(year('2025')).not.toHaveAttribute('open')
  expect(year('2024')).not.toHaveAttribute('open')
  expect(year('2026')).toHaveTextContent('3 albums')
  expect(year('2025')).toHaveTextContent('4 albums')
})

test('album arrows slide one frame at a time and wrap at the ends', () => {
  const width = vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(400)
  at('/gallery')
  const title = 'Seattle and Olympic National Park'
  const scroller = screen.getByTestId(`photos-${title}`)
  const scrollTo = vi.fn()
  scroller.scrollTo = scrollTo
  expect(screen.getByText('1 / 5')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: `Next photo: ${title}` }))
  expect(scrollTo).toHaveBeenLastCalledWith({ left: 400 })
  fireEvent.click(screen.getByRole('button', { name: `Previous photo: ${title}` }))
  expect(scrollTo).toHaveBeenLastCalledWith({ left: 1600 }) // first photo wraps to the last

  scroller.scrollLeft = 800
  fireEvent.scroll(scroller)
  expect(screen.getByText('3 / 5')).toBeInTheDocument()
  width.mockRestore()
})

test('a single-photo album has no arrows', () => {
  at('/gallery')
  expect(screen.queryByRole('button', { name: /Yosemite National Park/ })).not.toBeInTheDocument()
})

test('albums are newest first within each year', () => {
  at('/gallery')
  const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
  expect(titles).toEqual([
    'Seattle and Olympic National Park',
    'ECS 249th Meeting Poster Session',
    'With Prof. Chao-Yang Wang',
    '2025 KSAE Autumn Conference',
    'Yosemite National Park',
    'Battery Thermal Management Conference',
    'Google Headquarters',
    'KITECH Jeju Visit',
    '2024 KSAE Autumn Conference',
    'Ansys Simulation World 2024',
    '2024 KSAE Spring Conference',
  ])
})
