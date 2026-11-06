import { render, screen } from '@testing-library/react'
import { ProfileHero } from './ProfileHero'

test('CV is always shown; only entries with an address are links', () => {
  render(<ProfileHero />)
  const links = screen.getAllByRole('link').map((a) => a.textContent ?? '')
  expect(links.some((t) => t.startsWith('Scholar'))).toBe(true)
  expect(links.some((t) => t.startsWith('LinkedIn'))).toBe(true)
  // CV is shown before its PDF exists, but only becomes a link once href is set
  expect(screen.getByText(/^CV/)).toBeInTheDocument()
  expect(links.some((t) => t.startsWith('CV'))).toBe(false)
  expect(screen.queryByText(/GitHub/)).toBeNull()
})

test('shows name, both affiliation lines, and the email', () => {
  render(<ProfileHero />)
  expect(screen.getByRole('heading', { name: 'Soomin Choi' })).toBeInTheDocument()
  expect(screen.getByText('M.S./Ph.D. Student · Renewable Engine Analysis Laboratory (REAL)')).toBeInTheDocument()
  expect(screen.getByText('Dept. of Mechanical Design Engineering, Hanyang University')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /qkqhsm1@hanyang\.ac\.kr/ })).toBeInTheDocument()
})
