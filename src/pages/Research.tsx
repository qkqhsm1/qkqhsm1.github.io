import { Link } from 'react-router-dom'
import { PageShell } from '@/components/PageShell'
import { BayesFigure, CellFigure, SimulationFigure } from '@/components/ResearchFigures'
import { researchAreas, type ResearchFigure } from '@/content/research'

const FIGURES: Record<ResearchFigure, () => React.JSX.Element> = { cell: CellFigure, grid: SimulationFigure, bayes: BayesFigure }

export function Research() {
  return (
    <PageShell
      active="research"
      hero={<h1 className="text-[44px] font-semibold leading-none tracking-[-1px] text-navy">Research</h1>}
    >
      {researchAreas.map((a) => {
        const Figure = FIGURES[a.figure]
        return (
          // Figure left, text right, matching the logo | text rhythm on Home.
          <section key={a.title} className="mt-14 grid gap-6 border-b border-rule pb-14 md:grid-cols-[380px_1fr] md:gap-12">
            <figure className="min-w-0">
              <Figure />
              <figcaption className="mt-2 text-[13px] text-sub">Schematic</figcaption>
            </figure>
            <div className="min-w-0">
              <h2 className="mb-4 border-l-4 border-teal pl-3 text-[26px] font-semibold leading-[1.1]">{a.title}</h2>
              <p className="text-[17px] leading-[1.7]">{a.summary}</p>
              {a.link && (
                <Link to={a.link.to} className="mt-3 inline-block text-[17px] font-medium text-teal hover:text-navy">
                  {a.link.label}
                </Link>
              )}
            </div>
          </section>
        )
      })}
    </PageShell>
  )
}
