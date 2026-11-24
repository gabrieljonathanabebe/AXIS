import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  PanelBottom,
  PanelLeft,
  PanelRight,
  PanelTop,
} from 'lucide-react'

import { getPlacementLabel, isSide } from '@/shared/layout'
import DetailsControl from '../controls/DetailsControl'
import PositionGrid from '../controls/PositionGrid'
import SegmentedControl from '../controls/SegmentedControl'
import BoxRow from '../rows/BoxRow'
import Row from '../rows/Row'

import type { LucideIcon } from 'lucide-react'
import type { PartialLayout, Side } from '@/shared/layout'
import type { OptionItem } from '../primitives/Menu'
import type { LayoutBox } from '../rows/BoxRow'

// ===== TYPES =================================================================
/** Positions the layout allows, e.g. the four sides of a legend. */
type LayoutPosition<TLayout extends PartialLayout> = NonNullable<
  TLayout['position']
>

type PositionGroupProps<TLayout extends PartialLayout> = {
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

/** Icons of the position field: the side an element sits at. */
const placementIcons = {
  bottom: PanelBottom,
  left: PanelLeft,
  right: PanelRight,
  top: PanelTop,
} satisfies Record<Side, LucideIcon>

/** Icons that still fit one field column; more take both. */
const MAX_ICONS_PER_COLUMN = 3

// ===== COMPONENT =============================================================
/**
 * Rows of the Position group: where an element sits in its parent. A box
 * shows X | Y with the unit and bounds of the element, e.g. grid cells of
 * a chart. An element at all four sides gets a field that names its place
 * and opens a `PositionGrid`: the full grid with an alignment, e.g. of a
 * legend, the cross without, e.g. of a color scale. Other positions are
 * an icon group: sides show only the arrow, positions with their own
 * icon, e.g. of the data labels, icon and word across the row. A single
 * position needs no control. Reads only its fields, so it takes the same
 * layout as `LayoutGroup`.
 */
function PositionGroup<TLayout extends PartialLayout>({
  box,
  label,
  positions = sideOptions as OptionItem<LayoutPosition<TLayout>>[],
  value,
  onChange,
}: PositionGroupProps<TLayout>) {
  const { alignment, position } = value
  const showsPlacement =
    position !== undefined &&
    isSide(position) &&
    positions.length === sideOptions.length &&
    positions.every((option) => isSide(option.value))
  const PlacementIcon = showsPlacement ? placementIcons[position] : null
  const showsIcons =
    !showsPlacement && position !== undefined && positions.length > 1
  const isWide =
    positions.length > MAX_ICONS_PER_COLUMN ||
    positions.some((option) => option.icon)
  return (
    <>
      {box ? <BoxRow box={box} fields={['x', 'y']} label={label} /> : null}
      {showsPlacement && PlacementIcon ? (
        <Row layout="wide">
          <DetailsControl
            fitsContent
            icon={<PlacementIcon size={14} />}
            label={`${label} position`}
            text={getPlacementLabel(position, alignment)}
          >
            <PositionGrid
              label={`${label} position`}
              value={{ alignment, position }}
              variant={alignment === undefined ? 'cross' : 'grid'}
              onChange={(placement) => onChange({ ...value, ...placement })}
            />
          </DetailsControl>
        </Row>
      ) : null}
      {showsIcons ? (
        <Row layout={isWide ? 'wide' : 'single'}>
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
        </Row>
      ) : null}
    </>
  )
}

export default PositionGroup
