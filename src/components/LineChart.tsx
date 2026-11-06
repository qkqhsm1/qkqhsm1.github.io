import { downsampleMinMax, niceTicks, yDomain } from '@/lib/chart'

const W = 640, H = 260
const M = { left: 62, right: 16, top: 12, bottom: 50 }

export function LineChart({ title, unit, x, y }: { title: string; unit: string; x: Float64Array; y: Float64Array }) {
  const d = downsampleMinMax(x, y, 400)
  const [y0, y1] = yDomain(d.y)
  const x0 = Math.min(0, d.x[0] ?? 0) // time axis starts at 0 s; the first sample is at 1 s
  const x1 = d.x.length > 1 && d.x[d.x.length - 1] > x0 ? d.x[d.x.length - 1] : x0 + 1
  const sx = (v: number) => M.left + ((v - x0) / (x1 - x0)) * (W - M.left - M.right)
  const sy = (v: number) => H - M.bottom - ((v - y0) / (y1 - y0)) * (H - M.top - M.bottom)
  const points = d.x.map((v, i) => `${sx(v).toFixed(1)},${sy(d.y[i]).toFixed(1)}`).join(' ')

  return (
    <figure className="m-0">
      <figcaption className="mb-2 text-[15px] font-medium text-ink">
        {title} [{unit}]
      </figcaption>
      <svg role="img" aria-label={title} viewBox={`0 0 ${W} ${H}`} width="100%" className="block h-auto">
        {niceTicks(y0, y1, 6).map((t) => (
          <g key={`y${t}`}>
            <line x1={M.left} x2={W - M.right} y1={sy(t)} y2={sy(t)} stroke="#eceef1" />
            <text x={M.left - 8} y={sy(t)} dy="0.32em" textAnchor="end" fontSize="15" fill="#4a4f59">
              {t}
            </text>
          </g>
        ))}
        {niceTicks(x0, x1, 5).map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} x2={sx(t)} y1={M.top} y2={H - M.bottom} stroke="#eceef1" />
            <text x={sx(t)} y={H - M.bottom + 20} textAnchor="middle" fontSize="15" fill="#4a4f59">
              {t}
            </text>
          </g>
        ))}
        <text x={(M.left + W - M.right) / 2} y={H - 6} textAnchor="middle" fontSize="15" fill="#4a4f59">
          Time [s]
        </text>
        <polyline points={points} fill="none" stroke="#0e3a73" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    </figure>
  )
}
