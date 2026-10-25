import NumberInput from './NumberInput'

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
/**
 * Two native range inputs on one track; the thumbs cannot cross. Plain
 * numbers get a number field on each side, like `Slider`; with
 * `formatValue`, e.g. dates of a filter, the formatted values sit below.
 */
function RangeSlider({
  label,
  max,
  min,
  step = 1,
  value,
  formatValue,
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

  const track = (
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
          onValueChange([Math.min(event.currentTarget.valueAsNumber, end), end])
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
  )

  if (formatValue) {
    return (
      <div className="range-slider stack">
        {track}
        <div className="range-slider-values spread">
          <span>{formatValue(start)}</span>
          <span>{formatValue(end)}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="range-slider has-inputs">
      <NumberInput
        label={`${label} start value`}
        max={end}
        min={min}
        step={step}
        value={start}
        onValueChange={(nextStart) => onValueChange([nextStart, end])}
      />
      {track}
      <NumberInput
        label={`${label} end value`}
        max={max}
        min={start}
        step={step}
        value={end}
        onValueChange={(nextEnd) => onValueChange([start, nextEnd])}
      />
    </div>
  )
}

export default RangeSlider
