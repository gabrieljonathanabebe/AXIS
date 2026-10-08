import { HexColorInput, HexColorPicker } from 'react-colorful'
import { useState } from 'react'

import type { CSSProperties, ReactNode } from 'react'

import Button from './Button'
import Popover from './Popover'

export type ColorPreset = {
  label: string
  value: string
  fill?: string
}

type ColorControlProps = {
  label: string
  value: string
  presets?: ColorPreset[]
  variant?: 'inline' | 'compact'
  onChange: (value: string) => void
}

const DEFAULT_CUSTOM_COLOR = '#8B5CF6'

const DEFAULT_COLOR_PRESETS: ColorPreset[] = [
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

function normalizeValue(value: string, presets: ColorPreset[]): string {
  const isRawPreset = presets.some((preset) => preset.value === value)
  return isRawPreset ? value : normalizeHex(value)
}

function isPresetColor(value: string, presets: ColorPreset[]): boolean {
  return presets.some((preset) => preset.value === value)
}

function ColorControl({
  label,
  presets = DEFAULT_COLOR_PRESETS,
  value,
  variant = 'inline',
  onChange,
}: ColorControlProps) {
  // ===== CONSTANTS ===========================================================
  const normalizedValue = normalizeValue(value, presets)
  const presetSelected = isPresetColor(normalizedValue, presets)

  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState<string | null>(
    presetSelected ? null : normalizedValue,
  )
  const activeCustomColor = presetSelected ? customColor : normalizedValue
  const pickerColor =
    activeCustomColor ??
    (variant === 'compact' ? normalizedValue : DEFAULT_CUSTOM_COLOR)
  // ===== FUNCTIONS ===========================================================
  // SELECT PRESET
  function selectPreset(presetValue: string): void {
    if (!presetSelected) {
      setCustomColor(normalizedValue)
    }
    onChange(presetValue)
    setIsOpen(false)
  }
  // SELECT CUSTOM COLOR
  function selectCustomColor(nextColor: string): void {
    const normalizedColor = normalizeHex(nextColor)
    setCustomColor(normalizedColor)
    onChange(normalizedColor)
  }
  // TOGGLE CUSTOM PICKER
  function toggleCustomPicker(): void {
    if (activeCustomColor) {
      onChange(activeCustomColor)
    }
    setIsOpen((currentValue) => !currentValue)
  }
  // RENDER PRESET SWATCHES
  function renderPresetSwatches(): ReactNode {
    return presets.map((preset) => {
      const isActive = normalizedValue === preset.value
      return (
        <Button
          className={`color-control-swatch ${preset.fill ? 'has-fill' : ''}`}
          type="button"
          role="radio"
          aria-label={preset.label}
          aria-checked={isActive}
          title={preset.label}
          style={
            {
              '--swatch-color': preset.fill
                ? 'var(--color-accent)'
                : preset.value,
              '--swatch-fill': preset.fill,
            } as CSSProperties
          }
          onClick={() => {
            selectPreset(preset.value)
          }}
          key={preset.value}
        />
      )
    })
  }
  // RENDER PICKER CONTENT
  function renderPickerContent(): ReactNode {
    return (
      <>
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
      </>
    )
  }
  if (variant === 'compact') {
    return (
      <div className="color-control color-control-compact">
        <Popover
          label={`${label} color`}
          open={isOpen}
          className="color-control-popover glass glass-thick"
          onOpenChange={setIsOpen}
          renderTrigger={(triggerProps) => (
            <Button
              {...triggerProps}
              className="color-control-swatch"
              type="button"
              aria-label={label}
              title={label}
              style={
                {
                  '--swatch-color': normalizedValue,
                } as CSSProperties
              }
              onClick={() => {
                setIsOpen((current) => !current)
              }}
            />
          )}
        >
          <div
            className="color-control-compact-presets"
            role="radiogroup"
            aria-label={`${label} presets`}
          >
            {renderPresetSwatches()}
          </div>
          {renderPickerContent()}
        </Popover>
      </div>
    )
  }
  // ===== JSX RETURN ==========================================================
  return (
    <div className="color-control">
      <div
        className="color-control-swatches"
        role="radiogroup"
        aria-label={label}
      >
        {renderPresetSwatches()}
        <Popover
          label={`${label} custom color`}
          open={isOpen}
          className="color-control-popover glass glass-thick"
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
          {renderPickerContent()}
        </Popover>
      </div>
    </div>
  )
}

export default ColorControl
