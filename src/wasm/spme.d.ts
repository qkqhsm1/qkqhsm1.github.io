// Hand-written types for the Emscripten build (spme.js + spme.wasm). The C++ source is private.
export type SpmeOutput = {
  time: Float64Array
  voltage: Float64Array
  temperatureK: Float64Array
  crate: Float64Array
  soc: Float64Array
  stop: 'voltage' | 'soc' | 'end' | 'error'
  message: string
}

export type SpmeModule = {
  /** charge = true starts from (x_neg, x_pos) = (0.05, 0.95) and stops at 4.2 V; crates are negative. */
  simulate(ambientK: number, crates: Float64Array, charge: boolean): SpmeOutput
}

export default function createSpme(): Promise<SpmeModule>
