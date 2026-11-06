import { crateSteps, type SimInput, type SimResult } from './sim'
import type { WorkerReply, WorkerRequest } from './sim.worker'

// ponytail: a fresh worker (and wasm load, a few ms) per run; reuse one worker if back-to-back runs feel slow
export function runSimulation(input: SimInput): Promise<SimResult> {
  const crates = crateSteps(input)
  const worker = new Worker(new URL('./sim.worker.ts', import.meta.url), { type: 'module' })
  return new Promise<SimResult>((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<WorkerReply>) => (e.data.ok ? resolve(e.data.result) : reject(new Error(e.data.message)))
    worker.onerror = (e) => reject(new Error(e.message || 'Could not load the simulator.'))
    const req: WorkerRequest = { ambientK: input.tempK, crates, charge: input.mode === 'charge' }
    worker.postMessage(req, [crates.buffer])
  }).finally(() => worker.terminate())
}
