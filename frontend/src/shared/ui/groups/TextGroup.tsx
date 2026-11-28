import { ALargeSmall, Italic } from 'lucide-react'

import ColorControl from '../controls/ColorControl'
import FontWeightControl from '../controls/FontWeightControl'
import NumberControl from '../controls/NumberControl'
import SegmentedControl from '../controls/SegmentedControl'
import IconButton from '../primitives/IconButton'
import Row from '../rows/Row'
import { ALIGNMENT_OPTIONS } from './alignmentOptions'
import Group from './Group'

import type { ReactNode } from 'react'
import type { HorizontalAlignment } from '@/shared/layout'
import type { TextStyle } from '@/shared/textStyle'
import type { GroupHeadProps } from './Group'

// ===== TYPES =================================================================
/** Alignment of the text an element offers, e.g. of a title. */
type TextAlignment = {
  value: HorizontalAlignment
  onChange: (value: HorizontalAlignment) => void
}

type TextGroupProps = GroupHeadProps & {
  alignment?: TextAlignment
  /** Rows before the text rows, e.g. the text of an axis title. */
  children?: ReactNode
  label: string
  maxFontSize?: number
  minFontSize?: number
  value: TextStyle
  onChange: (value: TextStyle) => void
}

// ===== COMPONENT =============================================================
/**
 * Text group: size, weight and italic, then color and, if the element has
 * one, its alignment. Rows of its own come first as `children`, e.g. the
 * text of an axis title; `title` names a text other than the element's
 * own, e.g. "Selection" below a card value.
 * @param props Heading, rows before, text style, its bounds and optional
 *   alignment.
 */
function TextGroup({
  alignment,
  children,
  group,
  label,
  maxFontSize = 28,
  minFontSize = 9,
  title = 'Text',
  value,
  visibility,
  onChange,
}: TextGroupProps) {
  const isItalic = value.fontStyle === 'italic'
  return (
    <Group group={group} title={title} visibility={visibility}>
      {children}
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
    </Group>
  )
}

export default TextGroup
