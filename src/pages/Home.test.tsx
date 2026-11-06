import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'

function renderHome(today: string) {
  return render(
    <MemoryRouter>
      <Home today={new Date(today)} />
    </MemoryRouter>,
  )
}

test('sections appear in the approved order', () => {
  renderHome('2026-11-06')
  const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(titles).toEqual(['Education', 'Publications', 'Projects', 'Presentations'])
})

test('education lists three schools including the transfer', () => {
  renderHome('2026-11-06')
  const edu = screen.getByRole('region', { name: 'Education' })
  expect(within(edu).getAllByRole('listitem')).toHaveLength(3)
  expect(within(edu).getByText(/Transferred to Hanyang University ERICA/)).toBeInTheDocument()
})

test('my name is teal only where I lead', () => {
  renderHome('2026-11-06')
  const pubs = within(screen.getByRole('region', { name: 'Publications' })).getAllByRole('listitem')
  expect(within(pubs[0]).getByText('S. Choi')).toHaveClass('text-teal')
  expect(within(pubs[1]).getByText('S. Choi')).not.toHaveClass('text-teal')
  expect(within(pubs[1]).getByText('S. Choi')).toHaveClass('font-semibold')
})

test('UPCOMING disappears after the presentation date', () => {
  renderHome('2026-11-06')
  expect(screen.getAllByText('UPCOMING')).toHaveLength(1)
})

test('no UPCOMING once every date has passed', () => {
  renderHome('2026-11-20')
  expect(screen.queryByText('UPCOMING')).toBeNull()
})

test('doi links resolve and missing pdfs are not rendered', () => {
  renderHome('2026-11-06')
  const dois = screen.getAllByRole('link', { name: '[doi]' }).map((a) => a.getAttribute('href'))
  expect(dois[0]).toBe('https://doi.org/10.1016/j.jpowsour.2026.241369')
  expect(screen.queryByText('[pdf]')).toBeNull()
})

test('no counters or footer text', () => {
  const { container } = renderHome('2026-11-06')
  expect(container.textContent).not.toMatch(/\/ 0\d|©|—/)
})
