// @vitest-environment node
import createSpme from '@/wasm/spme.js'
import { crateSteps } from '@/sim/sim'

test('1 C discharge at 298 K stops at 5% SOC after 3420 s', async () => {
  const m = await createSpme()
  const r = m.simulate(298, crateSteps({ mode: 'cc', tempK: 298, crate: 1 }), false)
  expect(r.stop).toBe('soc')
  expect(r.time.length).toBe(3420)
  expect(r.voltage[0]).toBeGreaterThan(3.9); expect(r.voltage[0]).toBeLessThan(4.3)
  expect(r.temperatureK.at(-1)!).toBeGreaterThan(298)
})
test('one UDDS lap from 100% SOC ends at 77.33% SOC like the P2D data', async () => {
  const m = await createSpme()
  const r = m.simulate(298, crateSteps({ mode: 'cycle', tempK: 298, cycle: 'udds' }), false)
  expect(r.stop).toBe('end')
  expect(r.time.length).toBe(1369)
  expect(r.soc.at(-1)!).toBeCloseTo(0.77327, 4) // output_UDDS_298K_lap1: 77.326 %
})
test('the engine reports, not crashes, when the cell leaves 193–423 K', async () => {
  const m = await createSpme()
  const r = m.simulate(160, new Float64Array(10).fill(1), false)
  expect(r.stop).toBe('error')
  expect(r.message).not.toBe('')
})
test('1 C charge from (0.05, 0.95) stops at the 4.2 V cutoff', async () => {
  const m = await createSpme()
  const r = m.simulate(298, crateSteps({ mode: 'charge', tempK: 298, crate: 1 }), true)
  expect(r.stop).toBe('voltage')
  expect(r.time.length).toBe(3940) // web/validate_wasm.py chg_1C_298K
  expect(r.voltage.at(-1)!).toBeGreaterThanOrEqual(4.2)
  expect(r.crate[0]).toBe(-1)
})
