import { ALargeSmall, Italic } from 'lucide-react'

import ColorControl from '../controls/ColorControl'
import FontWeightControl from '../controls/FontWeightControl'
import NumberControl from '../controls/NumberControl'
import SegmentedControl from '../controls/SegmentedControl'
import IconButton from '../primitives/IconButton'
import Row from '../rows/Row'
import { ALIGNMENT_OPTIONS } from './alignmentOptions'

import type { HorizontalAlignment } from '@/shared/layout'
import type { TextStyle } from '@/shared/textStyle'

// ===== TYPES =================================================================
/** Alignment of the text an element offers, e.g. of a title. */
type TextAlignment = {
  value: HorizontalAlignment
  onChange: (value: HorizontalAlignment) => void
}

type TextGroupProps = {
  alignment?: TextAlignment
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
 * rows.
 * @param props Text style, its bounds and optional alignment.
 */
function TextGroup({
  alignment,
  label,
  maxFontSize = 28,
  minFontSize = 9,
  value,
  onChange,
}: TextGroupProps) {
  const isItalic = value.fontStyle === 'italic'
  return (
    <>
      <Row
        action={
          <IconButton
            pressed={isItalic}
            label={`${label} italic`}
            size="xs"
            onClick={() => {
              onChange({ ...value, fontStyle: isItalic ? 'normal' : 'italic' })
            }}
          >
            <Italic size={14} />
          </IconButton>
        }
      >
        <NumberControl
          icon={<ALargeSmall size={14} />}
          label={`${label} font size`}
          max={maxFontSize}
          min={minFontSize}
          unit="px"
          value={value.fontSize}
          onValueChange={(fontSize) => onChange({ ...value, fontSize })}
        />
        <FontWeightControl
          label={`${label} font weight`}
          value={value.fontWeight}
          onValueChange={(fontWeight) => onChange({ ...value, fontWeight })}
        />
      </Row>
      <Row>
        <ColorControl
          label={label}
          value={value.color}
          onChange={(color) => onChange({ ...value, color })}
        />
        {alignment ? (
          <SegmentedControl
            iconOnly
            label={`${label} alignment`}
            options={ALIGNMENT_OPTIONS}
            value={alignment.value}
            onValueChange={alignment.onChange}
          />
        ) : null}
      </Row>
    </>
  )
}

export default TextGroup
