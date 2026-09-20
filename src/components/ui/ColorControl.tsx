import { HexColorInput, HexColorPicker } from 'react-colorful'
import { useState } from 'react'

import type { CSSProperties } from 'react'

import Button from './Button'
import Popover from './Popover'

type ColorControlProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

const DEFAULT_CUSTOM_COLOR = '#8B5CF6'

const colorPresets = [
  { label: 'Electric Blue', value: '#1E90FF' },
  { label: 'Violet', value: '#8B5CF6' },
  { label: 'Mint', value: '#34D399' },
  { label: 'Rose', value: '#FB7185' },
]

function normalizeHex(value: string): string {
  const trimmedValue = value.trim()
  const prefixedValue = trimmedValue.startsWith('#')
    ? trimmedValue
    : `#${trimmedValue}`

  return prefixedValue.toUpperCase()
}

function isPresetColor(value: string): boolean {
  const normalizedValue = normalizeHex(value)

  return colorPresets.some((preset) => {
    return preset.value === normalizedValue
  })
}

function ColorControl({ label, value, onChange }: ColorControlProps) {
  const normalizedValue = normalizeHex(value)
  const presetSelected = isPresetColor(normalizedValue)
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState<string | null>(
    presetSelected ? null : normalizedValue,
  )

  const activeCustomColor = presetSelected ? customColor : normalizedValue

  const pickerColor = activeCustomColor ?? DEFAULT_CUSTOM_COLOR

  function selectPreset(presetValue: string): void {
    if (!presetSelected) {
      setCustomColor(normalizedValue)
    }
    onChange(presetValue)
    setIsOpen(false)
  }

  function selectCustomColor(nextColor: string): void {
    const normalizedColor = normalizeHex(nextColor)
    setCustomColor(normalizedColor)
    onChange(normalizedColor)
  }

  function toggleCustomPicker(): void {
    if (activeCustomColor) {
      onChange(activeCustomColor)
    }
    setIsOpen((currentValue) => !currentValue)
  }

  return (
    <div className="color-control">
      <div
        className="color-control-swatches"
        role="radiogroup"
        aria-label={label}
      >
        {colorPresets.map((preset) => {
          const isActive = normalizedValue === preset.value

          return (
            <Button
              className="color-control-swatch"
              type="button"
              role="radio"
              aria-label={preset.label}
              aria-checked={isActive}
              title={preset.label}
              style={
                {
                  '--swatch-color': preset.value,
                } as CSSProperties
              }
              onClick={() => {
                selectPreset(preset.value)
              }}
              key={preset.value}
            />
          )
        })}
        <Popover
          label={`${label} custom color`}
          open={isOpen}
          className="color-control-popover"
          onOpenChange={setIsOpen}
          renderTrigger={(triggerProps) => (
            <Button
              {...triggerProps}
              className={[
                'color-control-swatch',
                'color-control-custom-swatch',
                activeCustomColor ? 'has-custom-color' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              role="radio"
              aria-label="Custom color"
              aria-checked={!presetSelected}
              title="Custom color"
              style={
                activeCustomColor
                  ? ({
                      '--swatch-color': activeCustomColor,
                    } as CSSProperties)
                  : undefined
              }
              onClick={toggleCustomPicker}
            />
          )}
        >
          <HexColorPicker color={pickerColor} onChange={selectCustomColor} />

          <label className="color-control-hex-field">
            <span>HEX</span>
            <HexColorInput
              className="color-control-hex-input"
              color={pickerColor}
              prefixed
              aria-label={`${label} hex value`}
              onChange={selectCustomColor}
            />
          </label>

          <div className="color-control-actions">
            <Button
              className="color-control-action"
              type="button"
              onClick={() => {
                selectCustomColor(DEFAULT_CUSTOM_COLOR)
              }}
            >
              Reset
            </Button>

            <Button
              className="color-control-action"
              type="button"
              isActive
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Done
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  )
}

export default ColorControl
