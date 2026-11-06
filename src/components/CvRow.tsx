import type { ReactNode } from 'react'
import type { Logo } from '@/content/cv'

const LOGO_SIZE: Record<Logo['kind'], string> = {
  emblem: 'h-14 w-14 object-contain',
  cover: 'h-[60px] w-[45px] object-cover shadow-[0_1px_3px_#0003]',
  wide: 'h-14 w-20 object-contain',
}

export function CvRow({ year, sub, logo, children }: { year: string; sub?: string; logo: Logo; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[80px_1fr] items-center gap-x-5 gap-y-1 border-b border-rule py-5 md:grid-cols-[210px_80px_1fr]">
      {/* On phones the date spans the row above logo + text. */}
      <div className="col-span-2 flex items-baseline gap-2 text-navy md:col-span-1 md:block">
        <div className="whitespace-nowrap text-[28px] font-medium leading-[1.1] tabular-nums">{year}</div>
        {sub && <div className="mt-1 text-[15px] text-sub">{sub}</div>}
      </div>
      <img src={logo.src} alt={logo.alt} className={`justify-self-center ${LOGO_SIZE[logo.kind]}`} />
      <div className="min-w-0 text-[18px] leading-normal">{children}</div>
    </li>
  )
}
