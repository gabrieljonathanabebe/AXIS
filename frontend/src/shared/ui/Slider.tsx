import NumberInput from './NumberInput'

import type { CSSProperties } from 'react'

type SliderProps = {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onValueChange: (value: number) => void
}

type SliderStyle = CSSProperties & {
  '--slider-progress': string
}

/** One value as a slider track with a number field beside it. */
function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onValueChange,
}: SliderProps) {
  const progress = ((value - min) / (max - min)) * 100
  const boundedProgress = Math.min(100, Math.max(0, progress))

  const sliderStyle: SliderStyle = {
    '--slider-progress': `${boundedProgress}%`,
  }

  return (
    <div className="slider">
      <input
        className="slider-track"
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        style={sliderStyle}
        onChange={(event) => {
          onValueChange(event.currentTarget.valueAsNumber)
        }}
      />
      <NumberInput
        label={`${label} value`}
        max={max}
        min={min}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  )
}

export default Slider
