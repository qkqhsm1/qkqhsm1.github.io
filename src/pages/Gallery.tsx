import { useRef, useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { albums, GALLERY_YEARS, type Album } from '@/content/gallery'

const yearOf = (a: Album) => Number(a.date.slice(0, 4))
const years = [...new Set([...GALLERY_YEARS, ...albums.map(yearOf)])].sort((a, b) => b - a)

const ARROW = 'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-[26px] leading-none text-white hover:bg-black/75'

// Same 4:3 frame for every album. CSS scroll-snap does the sliding, so touch swipe works without extra code.
function Photos({ title, photos }: Pick<Album, 'title' | 'photos'>) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  // ponytail: a click during a slide counts from the photo still on screen; track a target index if fast clicks matter
  const go = (step: number) => {
    const el = scroller.current
    if (el) el.scrollTo({ left: el.clientWidth * ((index + step + photos.length) % photos.length) })
  }

  return (
    <div className="relative mt-auto overflow-hidden rounded bg-tint">
      <div
        ref={scroller}
        data-testid={`photos-${title}`}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] motion-safe:scroll-smooth"
      >
        {photos.map((p) => (
          // ponytail: opening the full image in a new tab stands in for a lightbox
          <a key={p.src} href={p.src} target="_blank" rel="noreferrer" className="block w-full shrink-0 snap-start overflow-hidden">
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              style={{ objectPosition: p.position }}
              className="aspect-[4/3] w-full object-cover transition-transform hover:scale-[1.03]"
            />
          </a>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label={`Previous photo: ${title}`} onClick={() => go(-1)} className={`${ARROW} left-2`}>
            ‹
          </button>
          <button type="button" aria-label={`Next photo: ${title}`} onClick={() => go(1)} className={`${ARROW} right-2`}>
            ›
          </button>
          <p className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-0.5 text-[13px] text-white">
            {index + 1} / {photos.length}
          </p>
        </>
      )}
    </div>
  )
}

export function Gallery() {
  return (
    <PageShell active="gallery" hero={<h1 className="text-[44px] font-semibold leading-none tracking-[-1px] text-navy">Gallery</h1>}>
      {years.map((y) => {
        const list = albums.filter((a) => yearOf(a) === y).sort((a, b) => b.date.localeCompare(a.date))
        return (
          <section key={y} className="mt-14">
            <h2 className="border-b border-rule pb-2 text-[32px] font-semibold leading-none text-navy">{y}</h2>
            {list.length === 0 && <p className="mt-6 text-[17px] text-sub">Photos coming soon.</p>}
            {/* Two albums per row from md up, one on phones */}
            <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {list.map((a) => (
                <article key={`${a.date}-${a.title}`} className="flex min-w-0 flex-col">
                  <p className="mb-1 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">{a.category}</p>
                  <h3 className="border-l-4 border-teal pl-3 text-[21px] font-semibold leading-[1.2]">{a.title}</h3>
                  <p className="mt-2 text-[15px] text-sub">
                    {a.date}
                    {a.place && ` · ${a.place}`}
                  </p>
                  {a.caption && <p className="mb-5 mt-3 text-[16px] leading-[1.65]">{a.caption}</p>}
                  <Photos title={a.title} photos={a.photos} />
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </PageShell>
  )
}
