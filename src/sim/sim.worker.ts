import createSpme from '@/wasm/spme.js'
import type { SimResult, StopReason } from './sim'

export type WorkerRequest = { ambientK: number; crates: Float64Array; charge: boolean }
export type WorkerReply = { ok: true; result: SimResult } | { ok: false; message: string }

const isStop = (s: string): s is StopReason => s === 'voltage' || s === 'soc' || s === 'end'

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const reply = (r: WorkerReply, transfer: Transferable[] = []) => self.postMessage(r, { transfer })
  const m = await createSpme().catch(() => null)
  if (!m) return reply({ ok: false, message: 'Could not load the simulator.' })
  try {
    const { stop, message, ...arrays } = m.simulate(e.data.ambientK, e.data.crates, e.data.charge)
    if (!isStop(stop)) return reply({ ok: false, message: message || 'The simulation failed.' })
    const result: SimResult = { ...arrays, stop }
    reply({ ok: true, result }, [result.time, result.voltage, result.temperatureK, result.crate, result.soc].map((a) => a.buffer))
  } catch (err) {
    reply({ ok: false, message: err instanceof Error ? err.message : 'The simulation failed.' })
  }
}
