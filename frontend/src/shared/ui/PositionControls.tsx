import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'

import { isSide } from '../layout'
import BoxFieldsRow from './BoxFieldsRow'
import ControlRow from './ControlRow'
import PositionGrid from './PositionGrid'
import SegmentedControl from './SegmentedControl'

import type { LucideIcon } from 'lucide-react'
import type { PartialLayout, Side } from '../layout'
import type { LayoutBox } from './BoxFieldsRow'
import type { OptionItem } from './OptionsMenu'

// ===== TYPES =================================================================
/** Positions the layout allows, e.g. the four sides of a legend. */
type LayoutPosition<TLayout extends PartialLayout> = NonNullable<
  TLayout['position']
>

type PositionControlsProps<TLayout extends PartialLayout> = {
  box?: LayoutBox
  label: string
  positions?: OptionItem<LayoutPosition<TLayout>>[]
  value: TLayout
  onChange: (value: TLayout) => void
}

// ===== CONSTANTS =============================================================
const sideOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
] satisfies OptionItem<Side>[]

const sideIcons = {
  bottom: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
  top: ArrowUp,
} satisfies Record<Side, LucideIcon>

/** Icons that still fit one field column; more take both. */
const MAX_ICONS_PER_COLUMN = 3

// ===== COMPONENT =============================================================
/**
 * Rows of the Position group: where an element sits in its parent. A box
 * shows X | Y with the unit and bounds of the element, e.g. grid cells of
 * a chart. A side with an alignment, e.g. of a legend, is a
 * `PositionGrid`; other positions are an icon group: sides show only the
 * arrow, positions with their own icon, e.g. of the data labels, icon and
 * word across the row. A single position needs no control. Reads only its
 * fields, so it takes the same layout as `LayoutControls`.
 */
function PositionControls<TLayout extends PartialLayout>({
  box,
  label,
  positions = sideOptions as OptionItem<LayoutPosition<TLayout>>[],
  value,
  onChange,
}: PositionControlsProps<TLayout>) {
  const { alignment, position } = value
  const showsGrid =
    alignment !== undefined && position !== undefined && isSide(position)
  const showsIcons =
    !showsGrid && position !== undefined && positions.length > 1
  const isWide =
    positions.length > MAX_ICONS_PER_COLUMN ||
    positions.some((option) => option.icon)
  return (
    <>
      {box ? (
        <BoxFieldsRow box={box} fields={['x', 'y']} label={label} />
      ) : null}
      {showsGrid ? (
        <ControlRow layout="single">
          <PositionGrid
            label={`${label} position`}
            value={{ alignment, position }}
            onChange={(placement) => onChange({ ...value, ...placement })}
          />
        </ControlRow>
      ) : null}
      {showsIcons ? (
        <ControlRow layout={isWide ? 'wide' : 'single'}>
          <SegmentedControl
            className="layout-position-control"
            label={`${label} position`}
            options={positions}
            renderOption={(option) => {
              if (option.icon || !isSide(option.value)) {
                return null
              }
              const SideIcon = sideIcons[option.value]
              return <SideIcon aria-hidden="true" size={15} />
            }}
            value={position}
            onValueChange={(nextPosition) => {
              onChange({ ...value, position: nextPosition })
            }}
          />
        </ControlRow>
      ) : null}
    </>
  )
}

export default PositionControls
