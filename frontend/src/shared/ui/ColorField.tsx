import { HexColorInput } from 'react-colorful'

import { getColorValueKey, normalizeHex } from '../colorValue'
import ColorControl from './ColorControl'

import type { ColorValue } from '../colorValue'
import type { ColorPreset } from './ColorControl'

// ===== TYPES =================================================================
type ColorFieldProps = {
  label: string
  presets: ColorPreset[]
  value: ColorValue
  onChange: (value: ColorValue) => void
}

// ===== HELPERS ===============================================================
/**
 * Names a theme color by its swatch, e.g. "Default" or "Chart 2".
 * @param value Color of the field.
 * @param presets Swatches of the place.
 * @returns Label of the matching swatch, otherwise "Theme".
 */
function getSwatchLabel(value: ColorValue, presets: ColorPreset[]): string {
  const valueKey = getColorValueKey(value)
  const swatch = presets.find(
    (preset) => getColorValueKey(preset.value) === valueKey,
  )
  return swatch?.label ?? 'Theme'
}

// ===== COMPONENT =============================================================
/**
 * Field of one color: swatch with the color picker, then the hex value of
 * an own color or the swatch name of a theme color.
 * @param props Name of the paint, swatches, color and its handler.
 */
function ColorField({ label, presets, value, onChange }: ColorFieldProps) {
  return (
    <div className="field color-field">
      <ColorControl
        label={`${label} color`}
        presets={presets}
        value={value}
        variant="compact"
        onChange={onChange}
      />
      {value.kind === 'custom' ? (
        <HexColorInput
          className="color-field-hex"
          color={value.color}
          aria-label={`${label} hex value`}
          onChange={(hex) => {
            onChange({ kind: 'custom', color: normalizeHex(hex) })
          }}
        />
      ) : (
        <span className="color-field-name">
          {getSwatchLabel(value, presets)}
        </span>
      )}
    </div>
  )
}

export default ColorField
