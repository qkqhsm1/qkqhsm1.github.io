import { AuthorList, AuthorName } from '@/components/AuthorList'
import { CvRow } from '@/components/CvRow'
import { PageShell } from '@/components/PageShell'
import { ProfileHero } from '@/components/ProfileHero'
import { Section } from '@/components/Section'
import { education, presentations, projects, publications } from '@/content/cv'
import { formatMonthDay, formatYearRange, isUpcoming, THIN } from '@/lib/cv'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const month = (ym: string) => MONTHS[Number(ym.slice(5, 7)) - 1]
const year = (iso: string) => iso.slice(0, 4)

function Chip({ children, dashed = false }: { children: string; dashed?: boolean }) {
  return (
    <span
      className={
        dashed
          ? 'mr-1.5 border border-dashed border-teal px-2 text-[12px] font-medium text-teal'
          : 'mr-1.5 border-l-[3px] border-teal bg-teal/13 px-2 text-[12px] font-medium'
      }
    >
      {children}
    </span>
  )
}

const Link2 = ({ href, label }: { href: string; label: string }) => (
  <a href={href} target="_blank" rel="noopener" className="ml-1.5 text-[14px] text-teal underline-offset-2 hover:underline">
    {label}
  </a>
)

export function Home({ today = new Date() }: { today?: Date }) {
  return (
    <PageShell active="home" hero={<ProfileHero />}>
      <Section title="Education">
        {education.map((e) => (
          <CvRow key={e.institution} year={formatYearRange(e.start, e.end)} logo={e.logo}>
            <div className="font-semibold">
              {e.degree}, {e.institution}
            </div>
            <div className="text-sub">{e.detail}</div>
          </CvRow>
        ))}
      </Section>

      <Section title="Publications">
        {publications.map((p) => (
          <CvRow key={p.doi} year={year(p.date)} sub={formatMonthDay(p.date)} logo={p.logo}>
            <div className="font-semibold">{p.title}</div>
            <div className="text-sub">
              <AuthorList authors={p.authors} /> · <i>{p.journal}</i> {p.ref}
              <Link2 href={`https://doi.org/${p.doi}`} label="[doi]" />
              {p.pdf && <Link2 href={p.pdf} label="[pdf]" />}
            </div>
          </CvRow>
        ))}
      </Section>

      <Section title="Projects">
        {projects.map((p) => (
          <CvRow
            key={p.titleEn}
            year={formatYearRange(Number(year(p.start)), Number(year(p.end)))}
            sub={`${month(p.start)}${THIN}–${THIN}${month(p.end)}`}
            logo={p.logo}
          >
            <div className="font-semibold">{p.titleEn}</div>
            <div className="text-sub">
              {p.titleKo} · {p.sponsor}
            </div>
            <div className="text-sub">
              {p.roles.map((r, i) => (
                <span key={r.role}>
                  {i > 0 && ' · '}
                  {r.role}: <AuthorName author={r.person} />
                </span>
              ))}
            </div>
          </CvRow>
        ))}
      </Section>

      <Section title="Presentations">
        {presentations.map((p) => (
          <CvRow key={p.date} year={year(p.date)} sub={formatMonthDay(p.date)} logo={p.logo}>
            <div className="font-semibold">
              <Chip>{p.type}</Chip>
              {isUpcoming(p.date, today) && <Chip dashed>UPCOMING</Chip>}
              {p.event}, {p.place}
            </div>
            <div className="text-sub">
              "{p.title}" · <AuthorList authors={p.authors} />
            </div>
          </CvRow>
        ))}
      </Section>
    </PageShell>
  )
}
