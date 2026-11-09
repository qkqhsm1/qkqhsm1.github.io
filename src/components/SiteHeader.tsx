import { Link } from 'react-router-dom'
import { DOCS_URL } from '@/config'
import { cn } from '@/lib/utils'

export type Page = 'home' | 'research' | 'gallery' | 'battery-sim'

const PAGES: { id: Page; label: string; to: string }[] = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'research', label: 'Research', to: '/research' },
  { id: 'gallery', label: 'Gallery', to: '/gallery' },
  { id: 'battery-sim', label: 'Battery Sim', to: '/battery-sim' },
]

function Lock() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" className="ml-1 inline align-[-1px]" aria-hidden="true">
      <rect x="1" y="5" width="9" height="6.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function SiteHeader({ active }: { active: Page }) {
  const item = 'pb-0.5 text-sub hover:text-ink'
  return (
    <nav className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-9 pt-1 text-[14px] sm:text-[17px]">
      <Link to="/" className="text-[19px] font-semibold text-navy">
        S.CHOI
      </Link>
      {/* gap-x-3 and 14 px below sm keep all five items on one line down to 360 px */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-7">
        {PAGES.map((p) => (
          <Link
            key={p.id}
            to={p.to}
            aria-current={p.id === active ? 'page' : undefined}
            className={cn(item, p.id === active && 'border-b-[1.5px] border-teal text-teal hover:text-teal')}
          >
            {p.label}
          </Link>
        ))}
        {DOCS_URL ? (
          <a href={DOCS_URL} className={item} title="Private, sign-in required">
            Docs
            <Lock />
          </a>
        ) : (
          <span className="pb-0.5 text-sub/60" title="Private, not deployed yet">
            Docs
            <Lock />
          </span>
        )}
      </div>
    </nav>
  )
}
