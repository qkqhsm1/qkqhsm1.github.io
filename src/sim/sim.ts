import udds from './cycles/udds.txt?raw'
import ftp75 from './cycles/ftp75.txt?raw'
import wltp from './cycles/wltp.txt?raw'

export const CELL_CAPACITY_AH = 1.656
export const TEMP_K = { min: 253, max: 318, default: 298 }
export const CRATE = { min: 0.2, max: 3, default: 1 }

export type CycleId = 'udds' | 'ftp75' | 'wltp'
export const CYCLES: Record<CycleId, { label: string; text: string }> = {
  udds: { label: 'UDDS', text: udds },
  ftp75: { label: 'FTP75', text: ftp75 },
  wltp: { label: 'WLTP', text: wltp },
}

export type SimInput =
  | { mode: 'cc' | 'charge'; tempK: number; crate: number }
  | { mode: 'cycle'; tempK: number; cycle: CycleId }
export type StopReason = 'voltage' | 'soc' | 'end'
export type SimResult = {
  time: Float64Array
  voltage: Float64Array
  temperatureK: Float64Array
  crate: Float64Array
  soc: Float64Array
  stop: StopReason
}

/** `time[s] C-rate` rows -> one C-rate per 1 s step. Each row covers (t_prev, t], t_prev starts at 0. */
export function parseCycle(text: string): Float64Array {
  const steps: number[] = []
  let tPrev = 0
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue
    const [t, c] = line.trim().split(/\s+/).map(Number)
    const n = t - tPrev
    if (!Number.isInteger(n) || n < 0 || !Number.isFinite(c)) throw new Error(`Bad cycle row: ${line}`)
    for (let i = 0; i < n; i++) steps.push(c)
    tPrev = t
  }
  return Float64Array.from(steps)
}

export function crateSteps(input: SimInput): Float64Array {
  if (input.mode === 'cycle') return parseCycle(CYCLES[input.cycle].text)
  // CC charge: negative C-rate (I < 0); 1.5 h of steps, the 4.2 V stop comes first
  if (input.mode === 'charge') return new Float64Array(Math.ceil(5400 / input.crate)).fill(-input.crate)
  // ponytail: one hour of charge; the 5% SOC stop always comes first
  return new Float64Array(Math.ceil(3600 / input.crate)).fill(input.crate)
}

const inRange = (v: number, r: { min: number; max: number }) => Number.isFinite(v) && v >= r.min && v <= r.max

export function validateInput(input: SimInput): { field: 'tempK' | 'crate'; message: string } | null {
  if (!inRange(input.tempK, TEMP_K)) return { field: 'tempK', message: `Temperature must be ${TEMP_K.min}\u2009–\u2009${TEMP_K.max} K.` }
  if (input.mode !== 'cycle' && !inRange(input.crate, CRATE))
    return { field: 'crate', message: `C-rate must be ${CRATE.min}\u2009–\u2009${CRATE.max} C.` }
  return null
}

/** Electrode area [m²]: the 0.0842 in Q_neg/Q_pos and A_thermal of the engine configuration. */
export const ELECTRODE_AREA_M2 = 0.0842

/** Cumulative |∫I dt| per electrode area [Ah/m²] at 1 s steps. Net, so regen in a cycle counts back. */
export function capacityPerArea(crate: Float64Array): Float64Array {
  const out = new Float64Array(crate.length)
  let ah = 0
  crate.forEach((c, i) => {
    ah += (CELL_CAPACITY_AH * c) / 3600
    out[i] = Math.abs(ah) / ELECTRODE_AREA_M2
  })
  return out
}
