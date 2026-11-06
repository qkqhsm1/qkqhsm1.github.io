import { CYCLES, ELECTRODE_AREA_M2, capacityPerArea, crateSteps, parseCycle, validateInput } from '@/sim/sim'

test('cycles unroll to 1 s steps with the validated peaks', () => {
  expect(parseCycle(CYCLES.udds.text).length).toBe(1369)
  expect(parseCycle(CYCLES.ftp75.text).length).toBe(1877)
  expect(parseCycle(CYCLES.wltp.text).length).toBe(1800)
  const u = parseCycle(CYCLES.udds.text)
  expect(Math.max(...u)).toBeCloseTo(8.1, 6)
  expect(Math.min(...u)).toBeCloseTo(-4.4929, 6)
})
test('a 2 s row expands to two steps and a zero-length row is skipped', () => {
  expect([...parseCycle('0\t5\r\n2\t1\r\n3\t0.5\r\n')]).toEqual([1, 1, 0.5])
  expect(() => parseCycle('0\t1\n1.5\t1\n')).toThrow()
})
test('constant current fills one hour of charge at that rate', () => {
  const s = crateSteps({ mode: 'cc', tempK: 298, crate: 2 })
  expect(s.length).toBe(1800)
  expect(s.every((c) => c === 2)).toBe(true)
})
test('inputs outside the validated ranges are rejected', () => {
  const cc = (tempK: number, crate: number) => validateInput({ mode: 'cc', tempK, crate })
  expect(cc(253, 0.2)).toBeNull(); expect(cc(318, 3)).toBeNull()
  expect(cc(252.9, 1)?.field).toBe('tempK'); expect(cc(318.1, 1)?.field).toBe('tempK')
  expect(cc(298, 0.19)?.field).toBe('crate'); expect(cc(298, 3.01)?.field).toBe('crate')
  expect(cc(Number.NaN, 1)?.field).toBe('tempK')
  expect(validateInput({ mode: 'cycle', tempK: 298, cycle: 'udds' })).toBeNull()
  expect(cc(400, 1)?.message).toBe('Temperature must be 253\u2009–\u2009318 K.')
  expect(cc(298, 5)?.message).toBe('C-rate must be 0.2\u2009–\u20093 C.')
})
test('CC charge feeds negative C-rates with room past a full charge', () => {
  const s = crateSteps({ mode: 'charge', tempK: 298, crate: 2 })
  expect(s.length).toBe(2700)
  expect(s.every((c) => c === -2)).toBe(true)
  expect(validateInput({ mode: 'charge', tempK: 298, crate: 3.5 })?.field).toBe('crate')
})
test('capacity per unit area integrates net I dt over the 0.0842 m² electrode', () => {
  expect(ELECTRODE_AREA_M2).toBe(0.0842)
  const q = capacityPerArea(new Float64Array(3600).fill(-1))
  expect(q.length).toBe(3600)
  expect(q[0]).toBeCloseTo(1.656 / 3600 / 0.0842, 12)
  expect(q.at(-1)!).toBeCloseTo(1.656 / 0.0842, 9) // 1 h at 1 C = 19.67 Ah/m²
})
