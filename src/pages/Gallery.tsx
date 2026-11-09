import { PageShell } from '@/components/PageShell'
import { albums, GALLERY_YEARS, type Album } from '@/content/gallery'

const yearOf = (a: Album) => Number(a.date.slice(0, 4))
const years = [...new Set([...GALLERY_YEARS, ...albums.map(yearOf)])].sort((a, b) => b - a)

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
                  {a.caption && <p className="mt-3 text-[16px] leading-[1.65]">{a.caption}</p>}
                  <div className={a.photos.length === 1 ? 'mt-auto pt-5' : 'mt-auto grid grid-cols-2 gap-2 pt-5'}>
                    {a.photos.map((p) => (
                      // ponytail: opening the full image in a new tab stands in for a lightbox
                      <a key={p.src} href={p.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded bg-tint">
                        <img
                          src={p.src}
                          alt={p.alt}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform hover:scale-[1.03]"
                        />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </PageShell>
  )
}
