import { useEffect, useState } from 'react'
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

function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onValueChange,
}: SliderProps) {
  const [draftValue, setDraftValue] = useState(String(value))
  const progress = ((value - min) / (max - min)) * 100
  const boundedProgress = Math.min(100, Math.max(0, progress))

  const sliderStyle: SliderStyle = {
    '--slider-progress': `${boundedProgress}%`,
  }

  useEffect(() => {
    setDraftValue(String(value))
  }, [value])

  function commitDraftValue() {
    const parsedValue = Number(draftValue)

    if (!Number.isFinite(parsedValue)) {
      setDraftValue(String(value))
      return
    }

    const nextValue = Math.min(max, Math.max(min, parsedValue))

    setDraftValue(String(nextValue))
    onValueChange(nextValue)
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

      <input
        className="slider-number"
        type="number"
        aria-label={`${label} value`}
        min={min}
        max={max}
        step={step}
        value={draftValue}
        onChange={(event) => {
          setDraftValue(event.currentTarget.value)
        }}
        onBlur={commitDraftValue}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commitDraftValue()
            event.currentTarget.blur()
          }
        }}
      />
    </div>
  )
}

export default Slider
