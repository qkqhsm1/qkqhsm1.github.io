// Schematic figures for the Research page, drawn in the site palette.
// ponytail: concept drawings with illustrative curves, not measured data; swap for paper figures when available.
import type { ReactNode } from 'react'

const NAVY = '#0e3a73'
const TEAL = '#3d7c8a'
const INK = '#16181d'
const SUB = '#4a4f59'
const TINT = '#f3f6f9'
const RULE = '#d5dbe1'

const FONT = 'Inter, Pretendard, sans-serif'
const label = { fontFamily: FONT, fontSize: 12, fill: SUB } as const
const strong = { fontFamily: FONT, fontSize: 12.5, fontWeight: 600, fill: INK } as const
const math = { fontFamily: FONT, fontSize: 13, fontStyle: 'italic', fill: INK } as const

const Sub = ({ children }: { children: string }) => (
  <tspan baselineShift="sub" fontSize={9}>
    {children}
  </tspan>
)

function Frame({ name, children }: { name: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 480 320" role="img" aria-label={name} className="h-auto w-full rounded-sm border border-rule bg-white">
      {children}
    </svg>
  )
}

function Arrow({ id, color = INK }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill={color} />
    </marker>
  )
}

// Deterministic normal samples (LCG + Box–Muller) so the figure is identical on every render.
function normals(n: number, seed: number): number[] {
  let s = seed
  const u = () => ((s = (s * 1664525 + 1013904223) % 4294967296) + 1) / 4294967297
  const out: number[] = []
  while (out.length < n) {
    const r = Math.sqrt(-2 * Math.log(u()))
    const th = 2 * Math.PI * u()
    out.push(r * Math.cos(th), r * Math.sin(th))
  }
  return out.slice(0, n)
}

/* ---------- 1. Electrochemical Modeling: cell sandwich during discharge ---------- */

export function CellFigure() {
  const X = { cc1: 34, an: 46, sep: 186, ca: 294, cc2: 434 }
  const top = 78
  const bot = 228
  const field = (x0: number, grad: 'gA' | 'gC') =>
    [0, 1, 2, 3, 4].flatMap((row) =>
      [0, 1, 2, 3].map((col) => (
        <circle
          key={`${grad}${row}${col}`}
          cx={x0 + 20 + col * 33 + (row % 2 ? 8 : 0)}
          cy={top + 17 + row * 29}
          r={13}
          fill={`url(#${grad})`}
          stroke={grad === 'gA' ? NAVY : TEAL}
          strokeWidth={0.9}
        />
      )),
    )
  // Electrolyte concentration during discharge: high at the anode, low at the cathode.
  const ce = Array.from({ length: 41 }, (_, i) => {
    const x = X.an + ((X.cc2 - X.an) * i) / 40
    const y = 286 - 14 * Math.tanh((194 - (x - X.an)) / 110)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <Frame name="Cell cross-section schematic">
      <defs>
        {/* discharge: anode particles empty from the surface, cathode particles fill from the surface */}
        <radialGradient id="gA">
          <stop offset="0" stopColor={NAVY} stopOpacity={0.9} />
          <stop offset="1" stopColor="#dbe4ef" />
        </radialGradient>
        <radialGradient id="gC">
          <stop offset="0" stopColor="#e3f0f2" />
          <stop offset="1" stopColor={TEAL} stopOpacity={0.95} />
        </radialGradient>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={RULE} strokeWidth={1} />
        </pattern>
        <Arrow id="a1" />
        <Arrow id="a1t" color={TEAL} />
      </defs>

      {/* external circuit with load */}
      <path d={`M${X.cc1 + 6} ${top} V40 H210 M270 40 H${X.cc2 + 6} V${top}`} fill="none" stroke={SUB} strokeWidth={1.4} />
      <path d="M210 40 l5 -7 l10 14 l10 -14 l10 14 l10 -14 l10 14 l5 -7" fill="none" stroke={SUB} strokeWidth={1.4} />
      <text x="240" y="24" textAnchor="middle" style={label}>load</text>
      <path d="M104 40 H150" stroke={INK} strokeWidth={1.4} markerEnd="url(#a1)" />
      <text x="126" y="32" textAnchor="middle" style={math}>e⁻</text>

      {/* collectors (Cu | Al), electrodes, separator */}
      <rect x={X.cc1} y={top} width={12} height={bot - top} fill="#b87333" opacity={0.85} />
      <rect x={X.cc2} y={top} width={12} height={bot - top} fill="#a7adb5" />
      <rect x={X.an} y={top} width={X.sep - X.an} height={bot - top} fill={TINT} />
      <rect x={X.sep} y={top} width={X.ca - X.sep} height={bot - top} fill="url(#hatch)" stroke={RULE} />
      <rect x={X.ca} y={top} width={X.cc2 - X.ca} height={bot - top} fill={TINT} />
      {field(X.an, 'gA')}
      {field(X.ca, 'gC')}

      {[112, 153, 194].map((y) => (
        <path key={y} d={`M${X.sep - 10} ${y} H${X.ca + 10}`} stroke={TEAL} strokeWidth={1.6} markerEnd="url(#a1t)" />
      ))}
      <rect x="221" y="134" width="38" height="18" rx="2" fill="#fff" />
      <text x="240" y="147" textAnchor="middle" style={{ ...math, fill: TEAL, fontWeight: 600 }}>
        Li⁺
      </text>

      <text x={(X.an + X.sep) / 2} y={top - 8} textAnchor="middle" style={strong}>Anode</text>
      <text x={(X.sep + X.ca) / 2} y={top - 8} textAnchor="middle" style={strong}>Separator</text>
      <text x={(X.ca + X.cc2) / 2} y={top - 8} textAnchor="middle" style={strong}>Cathode</text>

      {/* electrolyte concentration profile */}
      <line x1={X.an} y1="304" x2={X.cc2} y2="304" stroke={RULE} />
      <polyline points={ce} fill="none" stroke={NAVY} strokeWidth={1.8} />
      <text x={X.an} y="256" style={math}>
        c<Sub>e</Sub>(x)
      </text>
      <text x={X.an + 40} y="256" style={label}>electrolyte concentration</text>
      <text x={X.cc2} y="318" textAnchor="end" style={math}>x</text>
    </Frame>
  )
}

/* ---------- 2. Electrochemical Simulation: voltage and temperature vs time ---------- */

const RATES: [number, string][] = [
  [0.5, TEAL],
  [1, NAVY],
  [2, SUB],
]
const VCUT = 3.0

// Illustrative constant-current discharge (shape only). q = delivered capacity fraction.
const voltage = (q: number, c: number) => 4.18 - 0.55 * q - 0.42 * q ** 10 - 0.06 * c
function discharge(c: number) {
  const pts: { t: number; v: number; T: number }[] = []
  for (let q = 0; q <= 1.2; q += 0.01) {
    const v = voltage(q, c)
    if (v < VCUT) break
    const t = q / c // hours
    // Joule-dominated heating approaching a C²-scaled plateau, with a late rise near end of discharge.
    const T = 25 + 3.6 * c * c * (1 - Math.exp(-t * c * 2.2)) * (0.75 + 0.25 * q ** 4)
    pts.push({ t, v, T })
  }
  return pts
}

function Plot({
  x0, x1, y0, y1, title, yLo, yHi, yLabel, ticks, pick,
}: {
  x0: number; x1: number; y0: number; y1: number; title: string
  yLo: number; yHi: number; yLabel: ReactNode; ticks: number[]
  pick: (p: { t: number; v: number; T: number }) => number
}) {
  const tMax = 2.2
  const sx = (t: number) => x0 + (t / tMax) * (x1 - x0)
  const sy = (y: number) => y1 - ((y - yLo) / (yHi - yLo)) * (y1 - y0)
  return (
    <g>
      <text x={x0} y={y0 - 14} style={strong}>{title}</text>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x0} y1={sy(v)} x2={x1} y2={sy(v)} stroke={RULE} strokeDasharray="3 3" />
          <text x={x0 - 6} y={sy(v) + 4} textAnchor="end" style={label}>{v}</text>
        </g>
      ))}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={SUB} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={SUB} />
      {RATES.map(([c, col]) => (
        <polyline
          key={c}
          points={discharge(c).map((p) => `${sx(p.t).toFixed(1)},${sy(pick(p)).toFixed(1)}`).join(' ')}
          fill="none"
          stroke={col}
          strokeWidth={2}
        />
      ))}
      {[0, 1, 2].map((t) => (
        <text key={t} x={sx(t)} y={y1 + 15} textAnchor="middle" style={label}>{t}</text>
      ))}
      <text x={(x0 + x1) / 2} y={y1 + 30} textAnchor="middle" style={math}>t [h]</text>
      <text x={x0 - 30} y={(y0 + y1) / 2} textAnchor="middle" style={math} transform={`rotate(-90 ${x0 - 30} ${(y0 + y1) / 2})`}>
        {yLabel}
      </text>
    </g>
  )
}

export function SimulationFigure() {
  return (
    <Frame name="Simulated voltage and temperature schematic">
      <Plot x0={62} x1={228} y0={70} y1={262} title="Terminal voltage" yLo={3.0} yHi={4.2} ticks={[3.0, 3.6, 4.2]} yLabel="V [V]" pick={(p) => p.v} />
      <Plot x0={292} x1={458} y0={70} y1={262} title="Cell temperature" yLo={24} yHi={44} ticks={[25, 30, 35, 40]} yLabel="T [°C]" pick={(p) => p.T} />
      <g transform="translate(62 312)">
        {RATES.map(([c, col], i) => (
          <g key={c} transform={`translate(${i * 70} 0)`}>
            <line x1="0" y1="-4" x2="16" y2="-4" stroke={col} strokeWidth={2} />
            <text x="22" y="0" style={label}>{c} C</text>
          </g>
        ))}
        <text x="230" y="0" style={label}>CC discharge, 25 °C ambient</text>
      </g>
    </Frame>
  )
}
/* ---------- 3. Parameter Identification: TPE loop around the SPM ---------- */

const gauss = (x: number, m: number, s: number) => Math.exp(-0.5 * ((x - m) / s) ** 2)

export function BayesFigure() {
  // Left panel: TPE densities over one parameter θj in [0, 5].
  const L = { x0: 34, x1: 222, y0: 84, y1: 236 }
  const lx = (t: number) => L.x0 + (t / 5) * (L.x1 - L.x0)
  const ly = (d: number) => L.y1 - d * (L.y1 - L.y0)
  const curve = (f: (t: number) => number) => {
    const pts: string[] = []
    for (let t = 0; t <= 5.001; t += 0.05) pts.push(`${lx(t).toFixed(1)},${ly(f(t)).toFixed(1)}`)
    return pts
  }
  const area = (f: (t: number) => number) => `M${lx(0)},${L.y1} L${curve(f).join(' L')} L${lx(5)},${L.y1} Z`
  const good = (t: number) => 0.86 * gauss(t, 1.45, 0.45)
  const bad = (t: number) => 0.68 * gauss(t, 2.75, 0.62)
  const ei = (t: number) => 0.9 * gauss(t, 1.15, 0.33)
  const kernels = [0.7, 1.0, 1.3, 1.5, 1.8, 2.05]
  const kernelsBad = [2.0, 2.4, 2.7, 3.0, 3.3, 3.6]

  // Right panel: measured vs simulated voltage under a dynamic load (illustrative).
  const R = { x0: 282, x1: 458, y0: 84, y1: 236 }
  const z = normals(300, 11)
  // Load held in segments (drive-cycle-like), voltage relaxes toward OCV - IR.
  let level = 0
  let v = 3.8
  const pts = z.map((n, i) => {
    if (i === 0 || Math.abs(z[(i * 7) % z.length]) > 1.15) level = Math.max(-0.6, Math.min(1.6, 0.6 * n + 0.4))
    const t = i / (z.length - 1)
    const target = 3.84 - 0.07 * t - 0.06 * level
    v += 0.35 * (target - v)
    return { t, data: v, sim: v + 0.008 * Math.sin(9 * t) - 0.004 * level }
  })
  const rx = (t: number) => R.x0 + t * (R.x1 - R.x0)
  const ry = (v: number) => R.y1 - ((v - 3.64) / (3.9 - 3.64)) * (R.y1 - R.y0)
  const trace = (k: 'data' | 'sim') => pts.map((p) => `${rx(p.t).toFixed(1)},${ry(p[k]).toFixed(1)}`).join(' ')

  const lane = { stroke: NAVY, strokeWidth: 2.4, fill: 'none' } as const

  return (
    <Frame name="Bayesian parameter identification schematic">
      <defs>
        <Arrow id="tpe-arrow" color={NAVY} />
      </defs>

      {/* loop: θ goes to the SPM, RMSE comes back to TPE */}
      <path d={`M446 64 V32 H46 V62`} {...lane} markerEnd="url(#tpe-arrow)" />
      <text x="250" y="22" textAnchor="middle" style={math}>
        RMSE(θ) = [Σ(V<Sub>sim</Sub> − V<Sub>data</Sub>)²/n]<tspan baselineShift="super" fontSize={9}>1/2</tspan>
      </text>
      <path d={`M128 262 V298 H370 V268`} {...lane} markerEnd="url(#tpe-arrow)" />
      <text x="250" y="314" textAnchor="middle" style={strong}>
        SPM parameters <tspan style={math}>θ</tspan>
      </text>

      {/* left: TPE */}
      <text x={(L.x0 + L.x1) / 2} y="74" textAnchor="middle" style={strong}>Bayesian update (TPE)</text>
      {kernels.map((m) => (
        <polyline key={`g${m}`} points={curve((t) => 0.13 * gauss(t, m, 0.28)).join(' ')} fill="none" stroke={TEAL} strokeWidth={0.7} strokeDasharray="2 2" />
      ))}
      {kernelsBad.map((m) => (
        <polyline key={`b${m}`} points={curve((t) => 0.11 * gauss(t, m, 0.32)).join(' ')} fill="none" stroke={SUB} strokeWidth={0.7} strokeDasharray="2 2" opacity={0.7} />
      ))}
      <path d={area(bad)} fill={SUB} opacity={0.12} />
      <polyline points={curve(bad).join(' ')} fill="none" stroke={SUB} strokeWidth={1.6} />
      <path d={area(good)} fill={TEAL} opacity={0.18} />
      <polyline points={curve(good).join(' ')} fill="none" stroke={TEAL} strokeWidth={1.8} />
      <polyline points={curve(ei).join(' ')} fill="none" stroke={NAVY} strokeWidth={1.8} />
      <line x1={lx(1.15)} y1={ly(0.9)} x2={lx(1.15)} y2={L.y1} stroke={NAVY} strokeDasharray="3 3" />
      <path
        d={`M${lx(1.15)},${ly(0.9) - 7} l2.1,4.6 5,.5 -3.8,3.3 1.1,4.9 -4.4,-2.6 -4.4,2.6 1.1,-4.9 -3.8,-3.3 5,-.5z`}
        fill={NAVY}
      />
      <line x1={L.x0} y1={L.y1} x2={L.x1} y2={L.y1} stroke={INK} />
      <line x1={L.x0} y1={L.y0} x2={L.x0} y2={L.y1} stroke={INK} />
      <text x={lx(1.15) - 7} y={ly(0.9) - 1} textAnchor="end" style={{ ...math, fill: NAVY }}>
        θ<tspan baselineShift="super" fontSize={9} fontStyle="normal">next</tspan>
      </text>
      <g transform={`translate(${lx(2.55)} ${L.y0 + 4})`} style={label}>
        <rect y="0" width="10" height="7" fill={TEAL} opacity={0.5} />
        <text x="14" y="7">l(θ): low RMSE</text>
        <rect y="13" width="10" height="7" fill={SUB} opacity={0.35} />
        <text x="14" y="20">g(θ): high RMSE</text>
        <line y1="30" x2="10" y2="30" stroke={NAVY} strokeWidth={1.8} />
        <text x="14" y="33">EI ∝ l / g</text>
      </g>
      <text x={L.x1} y={L.y1 + 15} textAnchor="end" style={math}>
        θ<Sub>j</Sub>
      </text>
      <text x={L.x0 - 8} y={(L.y0 + L.y1) / 2} textAnchor="middle" style={label} transform={`rotate(-90 ${L.x0 - 8} ${(L.y0 + L.y1) / 2})`}>
        density
      </text>

      {/* right: SPM evaluation */}
      <text x={(R.x0 + R.x1) / 2} y="74" textAnchor="middle" style={strong}>SPM evaluation</text>
      <rect x={R.x0} y={R.y0} width={R.x1 - R.x0} height={R.y1 - R.y0} fill="none" stroke={RULE} />
      <polyline points={trace('data')} fill="none" stroke={INK} strokeWidth={1.1} />
      <polyline points={trace('sim')} fill="none" stroke={TEAL} strokeWidth={1.1} strokeDasharray="4 2" />
      <line x1={R.x0 + 8} y1={R.y0 + 12} x2={R.x0 + 24} y2={R.y0 + 12} stroke={INK} strokeWidth={1.4} />
      <text x={R.x0 + 28} y={R.y0 + 16} style={label}>data</text>
      <line x1={R.x0 + 66} y1={R.y0 + 12} x2={R.x0 + 82} y2={R.y0 + 12} stroke={TEAL} strokeWidth={1.4} strokeDasharray="4 2" />
      <text x={R.x0 + 86} y={R.y0 + 16} style={label}>SPM</text>
      <text x={R.x1} y={R.y1 + 15} textAnchor="end" style={math}>t [s]</text>
      <text x={R.x0 - 8} y={(R.y0 + R.y1) / 2} textAnchor="middle" style={math} transform={`rotate(-90 ${R.x0 - 8} ${(R.y0 + R.y1) / 2})`}>
        V [V]
      </text>
    </Frame>
  )
}
