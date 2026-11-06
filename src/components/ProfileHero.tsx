import { useRef, useState } from 'react'
import { profile } from '@/content/cv'
import { copyEmail } from '@/lib/copyEmail'

export function ProfileHero() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  async function onEmailClick() {
    const result = await copyEmail(profile.email, navigator.clipboard, (url) => {
      window.location.href = url
    })
    if (result === 'copied') {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:gap-10">
      <img
        src={profile.photo}
        alt={profile.name}
        className="h-[172px] w-[132px] flex-none object-cover object-[50%_20%] sm:h-[250px] sm:w-[192px]"
      />
      {/* flex-none: the block is as wide as its longest line, so the link row can span exactly that width */}
      <div className="min-w-0 sm:flex-none sm:pb-1">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-1px] text-navy">{profile.name}</h1>
        <div className="mt-4 text-[18px] leading-snug sm:text-[19px]">
          <p>{profile.affiliation[0]}</p>
          <p>{profile.affiliation[1]}</p>
        </div>
        <div className="relative mt-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-1 text-[18.2px] font-medium text-teal sm:justify-between sm:gap-x-4 sm:text-[19.2px]">
          {profile.links.map((l) =>
            l.href ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener" className="hover:text-navy">
                {l.label} {l.icon}
              </a>
            ) : (
              // ponytail: shown before the file exists; set href in cv.ts to make it a link
              <span key={l.label} title="Coming soon">
                {l.label} {l.icon}
              </span>
            ),
          )}
          <button
            type="button"
            onClick={onEmailClick}
            title="클릭하면 복사"
            className="cursor-pointer font-normal text-ink underline decoration-ink decoration-[1.5px] underline-offset-4"
          >
            {profile.email}
          </button>
          <span
            aria-live="polite"
            className={`absolute right-0 top-full mt-1 text-xs text-teal transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}
          >
            {copied ? '복사됨 ✓' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
