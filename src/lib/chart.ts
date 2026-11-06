/** Keep the min and max of each bucket (in time order) plus the first and last point. */
export function downsampleMinMax(x: Float64Array, y: Float64Array, buckets: number): { x: number[]; y: number[] } {
  const n = Math.min(x.length, y.length)
  if (n <= 2 * buckets + 2) return { x: Array.from(x.subarray(0, n)), y: Array.from(y.subarray(0, n)) }
  const idx = [0]
  const inner = n - 2
  for (let b = 0; b < buckets; b++) {
    const start = 1 + Math.floor((b * inner) / buckets)
    const end = 1 + Math.floor(((b + 1) * inner) / buckets)
    let lo = start, hi = start
    for (let i = start; i < end; i++) {
      if (y[i] < y[lo]) lo = i
      if (y[i] > y[hi]) hi = i
    }
    if (start < end) idx.push(...(lo === hi ? [lo] : lo < hi ? [lo, hi] : [hi, lo]))
  }
  idx.push(n - 1)
  return { x: idx.map((i) => x[i]), y: idx.map((i) => y[i]) }
}

/** Min to max with 5% padding; a flat series is widened by max(0.5, 5% of its value). */
export function yDomain(y: ArrayLike<number>): [number, number] {
  let lo = Infinity, hi = -Infinity
  for (let i = 0; i < y.length; i++) {
    if (y[i] < lo) lo = y[i]
    if (y[i] > hi) hi = y[i]
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1]
  if (hi === lo) {
    const pad = Math.max(0.5, Math.abs(lo) * 0.05)
    return [lo - pad, hi + pad]
  }
  const pad = (hi - lo) * 0.05
  return [lo - pad, hi + pad]
}

/** Round ticks ({1, 2, 5} x 10^k spacing) inside [min, max], ascending. */
export function niceTicks(min: number, max: number, count: number): number[] {
  const raw = (max - min) / Math.max(1, count)
  if (!(raw > 0) || !Number.isFinite(raw)) return [min]
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = ([1, 2, 5, 10].find((m) => m * mag >= raw) ?? 10) * mag
  const ticks: number[] = []
  for (let k = Math.ceil(min / step); k * step <= max; k++) {
    const v = Number((k * step).toPrecision(12))
    if (v >= min && v <= max) ticks.push(v)
  }
  return ticks
}
