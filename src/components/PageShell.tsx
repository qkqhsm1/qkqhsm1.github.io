import type { ReactNode } from 'react'
import { SiteHeader, type Page } from './SiteHeader'

// Tinted top band (nav + optional hero) closed by a teal rule, then the page body.
export function PageShell({ active, hero, children }: { active: Page; hero?: ReactNode; children: ReactNode }) {
  const gutter = 'mx-auto max-w-[1080px] px-[max(16px,env(safe-area-inset-left,0px))] sm:px-10'
  return (
    <>
      <header className="border-b-[3px] border-teal bg-tint">
        <div className={`${gutter} pb-10 pt-4`}>
          <SiteHeader active={active} />
          {hero}
        </div>
      </header>
      <main className={`${gutter} pb-20`}>{children}</main>
    </>
  )
}
