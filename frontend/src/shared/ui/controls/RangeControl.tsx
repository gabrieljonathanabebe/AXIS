import { toStepIndices, toStepRange } from './rangeSteps'

import type { CSSProperties } from 'react'

// ===== TYPES =================================================================
type RangeControlProps<TStep extends number | string> = {
  end: TStep | null
  label: string
  start: TStep | null
  steps: TStep[]
  formatStep: (step: TStep) => string
  onRangeChange: (start: TStep | null, end: TStep | null) => void
}

type RangeControlStyle = CSSProperties & {
  '--range-end': string
  '--range-start': string
}

// ===== COMPONENT =============================================================
/**
 * Range over fixed steps, e.g. the values or days of a field: two native
 * range inputs on one track, the thumbs cannot cross, the formatted steps
 * of both sit below. A thumb at the first or last step leaves that side
 * open (null), so the full range is no filter. In the upper half the
 * start thumb lies on top, so both stay reachable.
 * @param props Steps, chosen range, their format and handler.
 */
function RangeControl<TStep extends number | string>({
  end,
  label,
  start,
  steps,
  formatStep,
  onRangeChange,
}: RangeControlProps<TStep>) {
  const lastIndex = steps.length - 1
  const [startIndex, endIndex] = toStepIndices(steps, start, end)
  const span = lastIndex || 1
  const style: RangeControlStyle = {
    '--range-end': `${(endIndex / span) * 100}%`,
    '--range-start': `${(startIndex / span) * 100}%`,
  }
  const isStartRaised = startIndex > span / 2

  /**
   * Reports the range of both thumbs as steps.
   * @param indices Indices of the start and end thumb.
   */
  function changeRange(indices: [number, number]): void {
    onRangeChange(...toStepRange(steps, indices))
  }

  return (
    <div className="range-control stack">
      <div className="range-control-track" style={style}>
        <input
          className={`range-control-input ${isStartRaised ? 'is-raised' : ''}`}
          type="range"
          aria-label={`${label} start`}
          max={lastIndex}
          min={0}
          value={startIndex}
          onChange={(event) => {
            changeRange([
              Math.min(event.currentTarget.valueAsNumber, endIndex),
              endIndex,
            ])
          }}
        />
        <input
          className="range-control-input"
          type="range"
          aria-label={`${label} end`}
          max={lastIndex}
          min={0}
          value={endIndex}
          onChange={(event) => {
            changeRange([
              startIndex,
              Math.max(event.currentTarget.valueAsNumber, startIndex),
            ])
          }}
        />
      </div>
      <div className="range-control-values spread">
        <span>{formatStep(steps[startIndex])}</span>
        <span>{formatStep(steps[endIndex])}</span>
      </div>
    </div>
  )
}

export default RangeControl
