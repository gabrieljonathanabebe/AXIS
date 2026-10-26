import { ALargeSmall, Italic } from 'lucide-react'

import AlignmentControl from './AlignmentControl'
import ColorField from './ColorField'
import { createStyleColorPresets } from './colorPresets'
import ControlRow from './ControlRow'
import FontWeightControl from './FontWeightControl'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'

import type { ColorValue } from '../colorValue'
import type { HorizontalAlignment } from '../layout'
import type { TextStyle } from '../textStyle'

// ===== TYPES =================================================================
/** Alignment of the text an element offers, e.g. of a title. */
type TextAlignment = {
  value: HorizontalAlignment
  onChange: (value: HorizontalAlignment) => void
}

type TextStyleControlsProps = {
  alignment?: TextAlignment
  defaultColor: ColorValue
  label: string
  maxFontSize?: number
  minFontSize?: number
  value: TextStyle
  onChange: (value: TextStyle) => void
}

// ===== COMPONENT =============================================================
/**
 * Rows of one text: size, weight and italic, then color and, if the
 * element has one, its alignment. Widgets place them next to their own
 * rows and pass the color the text gets when created as `defaultColor`.
 * @param props Text style, its bounds and optional alignment.
 */
function TextStyleControls({
  alignment,
  defaultColor,
  label,
  maxFontSize = 28,
  minFontSize = 9,
  value,
  onChange,
}: TextStyleControlsProps) {
  const isItalic = value.fontStyle === 'italic'
  return (
    <>
      <ControlRow>
        <ScrubbableNumber
          icon={<ALargeSmall size={14} />}
          label={`${label} font size`}
          max={maxFontSize}
          min={minFontSize}
          step={1}
          unit="px"
          value={value.fontSize}
          onValueChange={(fontSize) => onChange({ ...value, fontSize })}
        />
        <FontWeightControl
          label={`${label} font weight`}
          value={value.fontWeight}
          onValueChange={(fontWeight) => onChange({ ...value, fontWeight })}
        />
        <IconButton
          aria-pressed={isItalic}
          isActive={isItalic}
          label={`${label} italic`}
          size="sm"
          onClick={() => {
            onChange({ ...value, fontStyle: isItalic ? 'normal' : 'italic' })
          }}
        >
          <Italic size={14} />
        </IconButton>
      </ControlRow>
      <ControlRow>
        <ColorField
          label={label}
          presets={createStyleColorPresets(defaultColor)}
          value={value.color}
          onChange={(color) => onChange({ ...value, color })}
        />
        {alignment ? (
          <AlignmentControl
            label={`${label} alignment`}
            value={alignment.value}
            onValueChange={alignment.onChange}
          />
        ) : null}
      </ControlRow>
    </>
  )
}

export default TextStyleControls
