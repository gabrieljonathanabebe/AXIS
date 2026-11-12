import ControlRow from './ControlRow'
import ScrubbableNumber from './ScrubbableNumber'

import type { Box, NumberBounds } from '../layout'

// ===== TYPES =================================================================
/**
 * Position and size of an element with its unit and bounds, e.g. a chart
 * in grid cells, limited like dragging. Shows only the fields it has.
 */
export type LayoutBox = {
  bounds: Partial<Record<keyof Box, NumberBounds>>
  /** Sign after the number, e.g. "px"; grid cells show none. */
  unit?: string
  /** Unit in words for the field names, e.g. "grid cells". */
  unitName: string
  value: Partial<Box>
  onChange: (patch: Partial<Box>) => void
}

type BoxFieldsRowProps = {
  box: LayoutBox
  fields: (keyof Box)[]
  label: string
}

// ===== CONSTANTS =============================================================
/** Letter in the icon slot and name of each box field, like in Figma. */
const boxFieldLabels = {
  height: { icon: 'H', name: 'height' },
  width: { icon: 'W', name: 'width' },
  x: { icon: 'X', name: 'x position' },
  y: { icon: 'Y', name: 'y position' },
} satisfies Record<keyof Box, { icon: string; name: string }>

// ===== COMPONENT =============================================================
/**
 * One row of box fields, e.g. X | Y in the position or W | H in the
 * layout, with the unit and bounds of the element. Shows a field for each
 * value the box has, and no row without one.
 * @param props Box, fields of the row and the name of the element.
 */
function BoxFieldsRow({ box, fields, label }: BoxFieldsRowProps) {
  const controls = fields
    .map((field) => {
      const value = box.value[field]
      if (value === undefined) {
        return null
      }
      const { icon, name } = boxFieldLabels[field]
      return (
        <ScrubbableNumber
          icon={icon}
          key={field}
          label={`${label} ${name} in ${box.unitName}`}
          max={box.bounds[field]?.max}
          min={box.bounds[field]?.min}
          unit={box.unit}
          value={value}
          onValueChange={(nextValue) => box.onChange({ [field]: nextValue })}
        />
      )
    })
    .filter((control) => control !== null)
  if (controls.length === 0) {
    return null
  }
  return <ControlRow>{controls}</ControlRow>
}

export default BoxFieldsRow
