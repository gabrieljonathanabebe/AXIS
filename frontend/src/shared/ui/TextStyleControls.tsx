import ColorControl from './ColorControl'
import ControlRow from './ControlRow'
import { createStyleColorPresets } from './colorPresets'
import { getRowLabel } from './getRowLabel'
import FontWeightControl from './FontWeightControl'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { ColorValue } from '../colorValue'
import type { FontStyle, TextStyle } from '../textStyle'

// ===== TYPES =================================================================
type TextStyleControlsProps = {
  defaultColor: ColorValue
  label: string
  maxFontSize?: number
  minFontSize?: number
  rowLabelPrefix?: string
  value: TextStyle
  onChange: (value: TextStyle) => void
}

// ===== CONSTANTS =============================================================
const fontStyleOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Italic', value: 'italic' },
] satisfies { label: string; value: FontStyle }[]

// ===== COMPONENT =============================================================
/**
 * Rows for color, size, weight and slant of one text. Widgets place
 * them next to their own rows, e.g. alignment or rotation, and pass the
 * color the text gets when created as `defaultColor`.
 */
function TextStyleControls({
  defaultColor,
  label,
  maxFontSize = 28,
  minFontSize = 9,
  rowLabelPrefix,
  value,
  onChange,
}: TextStyleControlsProps) {
  return (
    <>
      <ControlRow label={getRowLabel('Color', rowLabelPrefix)}>
        <ColorControl
          label={`${label} color`}
          presets={createStyleColorPresets(defaultColor)}
          value={value.color}
          onChange={(color) => onChange({ ...value, color })}
        />
      </ControlRow>
      <ControlRow label={getRowLabel('Size', rowLabelPrefix)}>
        <ScrubbableNumber
          label={`${label} font size`}
          max={maxFontSize}
          min={minFontSize}
          step={1}
          value={value.fontSize}
          onValueChange={(fontSize) => onChange({ ...value, fontSize })}
        />
      </ControlRow>
      <ControlRow label={getRowLabel('Weight', rowLabelPrefix)}>
        <FontWeightControl
          label={`${label} font weight`}
          value={value.fontWeight}
          onValueChange={(fontWeight) => onChange({ ...value, fontWeight })}
        />
      </ControlRow>
      <ControlRow label={getRowLabel('Style', rowLabelPrefix)}>
        <SegmentedControl
          label={`${label} font style`}
          options={fontStyleOptions}
          renderOption={(option) => (
            <span aria-hidden="true" style={{ fontStyle: option.value }}>
              A
            </span>
          )}
          value={value.fontStyle}
          onValueChange={(fontStyle) => onChange({ ...value, fontStyle })}
        />
      </ControlRow>
    </>
  )
}

export default TextStyleControls
