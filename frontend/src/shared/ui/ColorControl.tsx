import { HexColorInput, HexColorPicker } from 'react-colorful'
import { useState } from 'react'

import type { CSSProperties, ReactNode } from 'react'

import Button from './Button'
import Popover from './Popover'
import { getColorCss } from '../colorValue'

import type { ColorValue } from '../colorValue'

/**
 * Swatch of a color control. A preset that is no color, e.g. the glass
 * background, carries its own name as value and shows `fill`.
 */
export type ColorPreset<TPreset extends string = never> = {
  label: string
  value: ColorValue | TPreset
  fill?: string
}

type ColorControlProps<TPreset extends string = never> = {
  label: string
  value: ColorValue | NoInfer<TPreset>
  presets?: ColorPreset<TPreset>[]
  variant?: 'inline' | 'compact'
  onChange: (value: ColorValue | NoInfer<TPreset>) => void
}

const DEFAULT_CUSTOM_COLOR = '#8B5CF6'

/** Theme colors every color control offers unless it brings own presets. */
const DEFAULT_COLOR_PRESETS: ColorPreset[] = [
  { label: 'Text', value: { kind: 'token', token: 'text' } },
  { label: 'Muted', value: { kind: 'token', token: 'textMuted' } },
  { label: 'Accent', value: { kind: 'token', token: 'accent' } },
  { label: 'Grid line', value: { kind: 'token', token: 'gridLine' } },
  { label: 'Border', value: { kind: 'token', token: 'border' } },
]

function normalizeHex(value: string): string {
  const trimmedValue = value.trim()
  const prefixedValue = trimmedValue.startsWith('#')
    ? trimmedValue
    : `#${trimmedValue}`

  return prefixedValue.toUpperCase()
}

/**
 * Key that two equal choices share, e.g. `token:text` or `#1E90FF`.
 * @param value Value of the control or of a preset.
 * @returns Preset name, token key or normalized hex color.
 */
function getValueKey(value: ColorValue | string): string {
  if (typeof value === 'string') {
    return value
  }
  return value.kind === 'token'
    ? `token:${value.token}`
    : normalizeHex(value.color)
}

/**
 * Color a swatch shows; a named preset shows its fill and an accent ring.
 * @param value Value of the control or of a preset.
 * @returns CSS color of the swatch.
 */
function getSwatchColor(value: ColorValue | string): string {
  return typeof value === 'string' ? 'var(--color-accent)' : getColorCss(value)
}

function ColorControl<TPreset extends string = never>({
  label,
  presets = DEFAULT_COLOR_PRESETS,
  value,
  variant = 'inline',
  onChange,
}: ColorControlProps<TPreset>) {
  // ===== CONSTANTS ===========================================================
  const valueKey = getValueKey(value)
  const presetSelected = presets.some(
    (preset) => getValueKey(preset.value) === valueKey,
  )
  const valueCustomColor =
    typeof value !== 'string' && value.kind === 'custom'
      ? normalizeHex(value.color)
      : null
  const customSelected = valueCustomColor !== null && !presetSelected

  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState<string | null>(
    customSelected ? valueCustomColor : null,
  )
  const activeCustomColor = customSelected ? valueCustomColor : customColor
  const pickerColor =
    activeCustomColor ??
    (variant === 'compact' ? valueCustomColor : null) ??
    DEFAULT_CUSTOM_COLOR
  // ===== FUNCTIONS ===========================================================
  /**
   * Selects a preset and keeps the current custom color for later.
   * @param presetValue Value of the chosen preset.
   */
  function selectPreset(presetValue: ColorValue | TPreset): void {
    if (customSelected) {
      setCustomColor(valueCustomColor)
    }
    onChange(presetValue)
    setIsOpen(false)
  }
  /**
   * Selects a color from the picker or the hex field.
   * @param nextColor Hex color, with or without `#`.
   */
  function selectCustomColor(nextColor: string): void {
    const normalizedColor = normalizeHex(nextColor)
    setCustomColor(normalizedColor)
    onChange({ kind: 'custom', color: normalizedColor })
  }
  /** Opens or closes the picker and selects the remembered custom color. */
  function toggleCustomPicker(): void {
    if (activeCustomColor) {
      onChange({ kind: 'custom', color: activeCustomColor })
    }
    setIsOpen((currentValue) => !currentValue)
  }
  /** Renders one radio swatch per preset. */
  function renderPresetSwatches(): ReactNode {
    return presets.map((preset) => {
      const presetKey = getValueKey(preset.value)
      return (
        <Button
          className={`color-control-swatch ${preset.fill ? 'has-fill' : ''}`}
          type="button"
          role="radio"
          aria-label={preset.label}
          aria-checked={presetKey === valueKey}
          title={preset.label}
          style={
            {
              '--swatch-color': getSwatchColor(preset.value),
              '--swatch-fill': preset.fill,
            } as CSSProperties
          }
          onClick={() => {
            selectPreset(preset.value)
          }}
          key={presetKey}
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
                  '--swatch-color': getSwatchColor(value),
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
              aria-checked={customSelected}
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
