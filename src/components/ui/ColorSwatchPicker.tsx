import type { CSSProperties } from 'react'
import Button from './Button'

export type ColorOption = {
  label: string
  value: string
}

type ColorSwatchPickerProps = {
  label: string
  options: ColorOption[]
  value: string
  onChange: (value: string) => void
}

type ColorSwatchStyle = CSSProperties & {
  '--swatch-color': string
}

function ColorSwatchPicker({
  label,
  options,
  value,
  onChange,
}: ColorSwatchPickerProps) {
  return (
    <div className="color-swatch-picker" role="group" aria-label={label}>
      {options.map((option) => {
        const swatchStyle: ColorSwatchStyle = {
          '--swatch-color': option.value,
        }

        return (
          <Button
            className="color-swatch"
            aria-label={option.label}
            title={option.label}
            isActive={option.value === value}
            style={swatchStyle}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            <span className="color-swatch-fill" />
          </Button>
        )
      })}
    </div>
  )
}

export default ColorSwatchPicker
