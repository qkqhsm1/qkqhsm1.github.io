import { useRef, useState, type FormEvent } from 'react'
import { LineChart } from '@/components/LineChart'
import { PageShell } from '@/components/PageShell'
import { runSimulation } from '@/sim/client'
import { CRATE, CYCLES, TEMP_K, capacityPerArea, validateInput, type CycleId, type SimInput, type SimResult, type StopReason } from '@/sim/sim'

const DOI = '10.1016/j.jpowsour.2026.241369'
const stopText = (stop: StopReason, mode: SimInput['mode']) =>
  stop === 'soc' ? 'Stopped at 5% SOC.' : stop === 'end' ? 'Cycle finished.' : `Stopped at the ${mode === 'charge' ? '4.2' : '2.7'} V cutoff.`
const MODES = [
  ['cc', 'Constant current (discharge)'],
  ['charge', 'Constant current (charge)'],
  ['cycle', 'Driving cycle'],
] as const
const label = 'block text-[15px] font-medium text-ink'
const help = 'mt-1 text-[13px] text-sub'
const field =
  'mt-1.5 w-full max-w-[220px] rounded-md border border-sub/40 bg-white px-3 py-2 text-[16px] text-ink focus:border-teal focus:outline-none'
const fieldError = 'mt-1 text-[13px] font-medium text-navy'

export function BatterySim() {
  const [mode, setMode] = useState<SimInput['mode']>('cc')
  const [cycle, setCycle] = useState<CycleId>('udds')
  const [invalid, setInvalid] = useState<{ field: 'tempK' | 'crate'; message: string } | null>(null)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ mode: SimInput['mode']; sim: SimResult } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tempRef = useRef<HTMLInputElement>(null)
  const crateRef = useRef<HTMLInputElement>(null)

  async function onRun(e: FormEvent) {
    e.preventDefault()
    if (running) return
    // valueAsNumber is NaN for an empty or non-numeric field
    const tempK = tempRef.current?.valueAsNumber ?? Number.NaN
    const input: SimInput =
      mode === 'cycle' ? { mode, tempK, cycle } : { mode, tempK, crate: crateRef.current?.valueAsNumber ?? Number.NaN }
    const bad = validateInput(input)
    setInvalid(bad)
    if (bad) return
    setRunning(true)
    setResult(null)
    setError(null)
    try {
      setResult({ mode, sim: await runSimulation(input) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The simulation failed.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <PageShell
      active="battery-sim"
      hero={
        <>
          <h1 className="text-[44px] font-semibold leading-none tracking-[-1px] text-navy">Battery 1D Simulation (SPMe)</h1>
          <p className="mt-4 text-[15px] leading-[1.6] text-sub">
            Parameters from S. Choi et al., <i>J. Power Sources</i> 695, 241369 (2026).{' '}
            <a href={`https://doi.org/${DOI}`} className="break-all text-teal hover:text-navy">
              doi.org/{DOI}
            </a>
          </p>
        </>
      }
    >
      <form onSubmit={onRun} noValidate className="mt-10 grid gap-7 border-b border-rule pb-10">
        <fieldset>
          <legend className={label}>Mode</legend>
          <div className="mt-2 flex flex-wrap gap-x-7 gap-y-2 text-[16px]">
            {MODES.map(([id, text]) => (
              <label key={id} className="flex items-center gap-2">
                <input type="radio" name="mode" value={id} checked={mode === id} onChange={() => setMode(id)} className="accent-navy" />
                {text}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="tempK" className={label}>
              Temperature [K]
            </label>
            <input
              id="tempK"
              ref={tempRef}
              type="number"
              min={TEMP_K.min}
              max={TEMP_K.max}
              step={1}
              defaultValue={TEMP_K.default}
              aria-invalid={invalid?.field === 'tempK'}
              aria-describedby="tempK-help"
              className={field}
            />
            <p id="tempK-help" className={help}>
              {'Ambient and initial cell temperature, 253\u2009–\u2009318 K'}
            </p>
            {invalid?.field === 'tempK' && <p className={fieldError}>{invalid.message}</p>}
          </div>

          {mode !== 'cycle' ? (
            <div>
              <label htmlFor="crate" className={label}>
                C-rate
              </label>
              <input
                id="crate"
                ref={crateRef}
                type="number"
                min={CRATE.min}
                max={CRATE.max}
                step={0.1}
                defaultValue={CRATE.default}
                aria-invalid={invalid?.field === 'crate'}
                aria-describedby="crate-help"
                className={field}
              />
              <p id="crate-help" className={help}>
                {mode === 'charge' ? 'Charge from (0.05, 0.95) stoichiometry, 0.2\u2009–\u20093 C' : 'Discharge from 100% SOC, 0.2\u2009–\u20093 C'}
              </p>
              {invalid?.field === 'crate' && <p className={fieldError}>{invalid.message}</p>}
            </div>
          ) : (
            <div>
              <label htmlFor="cycle" className={label}>
                Driving cycle
              </label>
              <select
                id="cycle"
                value={cycle}
                onChange={(e) => setCycle(e.target.value as CycleId)}
                aria-describedby="cycle-help"
                className={field}
              >
                {(Object.keys(CYCLES) as CycleId[]).map((id) => (
                  <option key={id} value={id}>
                    {CYCLES[id].label}
                  </option>
                ))}
              </select>
              <p id="cycle-help" className={help}>
                Starts at 100% SOC and plays the cycle once.
              </p>
            </div>
          )}
        </div>

        <p className="text-[15px] text-sub">Cell capacity 1.656 Ah. Discharge stops at 5% SOC or 2.7&nbsp;V; charge stops at 4.2&nbsp;V.</p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={running}
            className="rounded-md bg-navy px-7 py-2.5 text-[16px] font-medium text-white hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            Run
          </button>
          <p aria-live="polite" className="text-[15px] text-sub">
            {running ? 'Running…' : result ? stopText(result.sim.stop, result.mode) : ''}
          </p>
        </div>
        {error && (
          <p role="alert" className="text-[15px] font-medium text-navy">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <LineChart title="Terminal voltage" unit="V" x={result.sim.time} y={result.sim.voltage} />
          <LineChart title="Cell temperature" unit="K" x={result.sim.time} y={result.sim.temperatureK} />
          <LineChart title="C-rate" unit="C" x={result.sim.time} y={result.sim.crate} />
          <LineChart
            title={`${result.mode === 'charge' ? 'Charge' : 'Discharge'} Capacity per Unit Area`}
            unit="Ah/m²"
            x={result.sim.time}
            y={capacityPerArea(result.sim.crate)}
          />
        </div>
      )}
    </PageShell>
  )
}
