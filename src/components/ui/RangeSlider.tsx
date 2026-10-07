import type { CSSProperties } from 'react'

// ===== TYPES =================================================================
export type RangeValue = [number, number]

type RangeSliderProps = {
  label: string
  max: number
  min: number
  step?: number
  value: RangeValue
  formatValue?: (value: number) => string
  onValueChange: (value: RangeValue) => void
}

type RangeSliderStyle = CSSProperties & {
  '--range-end': string
  '--range-start': string
}

// ===== COMPONENT =============================================================
// Two native range inputs on one track; the thumbs cannot cross.
function RangeSlider({
  label,
  max,
  min,
  step = 1,
  value,
  formatValue = String,
  onValueChange,
}: RangeSliderProps) {
  const [start, end] = value
  const span = max - min || 1
  const style: RangeSliderStyle = {
    '--range-end': `${((end - min) / span) * 100}%`,
    '--range-start': `${((start - min) / span) * 100}%`,
  }
  // The start thumb lies on top in the upper half, so both stay reachable.
  const isStartRaised = start > min + span / 2

  return (
    <div className="range-slider stack">
      <div className="range-slider-track" style={style}>
        <input
          className={`range-slider-input ${isStartRaised ? 'is-raised' : ''}`}
          type="range"
          aria-label={`${label} start`}
          max={max}
          min={min}
          step={step}
          value={start}
          onChange={(event) => {
            onValueChange([
              Math.min(event.currentTarget.valueAsNumber, end),
              end,
            ])
          }}
        />
        <input
          className="range-slider-input"
          type="range"
          aria-label={`${label} end`}
          max={max}
          min={min}
          step={step}
          value={end}
          onChange={(event) => {
            onValueChange([
              start,
              Math.max(event.currentTarget.valueAsNumber, start),
            ])
          }}
        />
      </div>
      <div className="range-slider-values spread">
        <span>{formatValue(start)}</span>
        <span>{formatValue(end)}</span>
      </div>
    </div>
  )
}

export default RangeSlider
