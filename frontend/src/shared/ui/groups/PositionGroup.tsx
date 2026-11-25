import { PanelBottom, PanelLeft, PanelRight, PanelTop } from 'lucide-react'

import { getPlacementLabel, getSideOrientation, isSide } from '@/shared/layout'
import DetailsControl from '../controls/DetailsControl'
import SegmentedControl from '../controls/SegmentedControl'
import BoxRow from '../rows/BoxRow'
import Row from '../rows/Row'
import {
  getPlacementOptions,
  toPlacement,
  toPlacementKey,
} from './placementOptions'

import type { LucideIcon } from 'lucide-react'
import type { PartialLayout, Side } from '@/shared/layout'
import type { OptionItem } from '@/shared/optionItem'
import type { LayoutBox } from '../rows/BoxRow'
import type { PlacementKey } from './placementOptions'

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

/** Icons of the position field: the side an element sits at. */
const placementIcons = {
  bottom: PanelBottom,
  left: PanelLeft,
  right: PanelRight,
  top: PanelTop,
} satisfies Record<Side, LucideIcon>

/** Icons that still fit one field column; more take both. */
const MAX_ICONS_PER_COLUMN = 3

// ===== FUNCTIONS =============================================================
/**
 * Mark of one place in the grid: a dot, for the chosen place a bar; left
 * and right stand upright, e.g. "left" → vertical, "top-end" → horizontal.
 * @param option Cell of the grid.
 * @returns Mark inside the cell button.
 */
function renderPlacementMark(option: OptionItem<PlacementKey>) {
  const { position } = toPlacement(option.value, false)
  return (
    <span
      aria-hidden="true"
      className={`position-grid-mark is-${getSideOrientation(position)}`}
    />
  )
}

// ===== COMPONENT =============================================================
/**
 * Rows of the Position group: where an element sits in its parent. A box
 * shows X | Y with the unit and bounds of the element, e.g. grid cells of
 * a chart. An element at all four sides gets a field that names its place
 * and opens a grid of places around the plot: all eight with an
 * alignment, e.g. of a legend, the cross of the four sides without, e.g.
 * of a color scale. Other positions are an icon group with icon and word,
 * e.g. of the data labels. A single position needs no control. Reads only
 * its fields, so it takes the same layout as `LayoutGroup`.
 */
function PositionGroup<TLayout extends PartialLayout>({
  box,
  label,
  positions = sideOptions as OptionItem<LayoutPosition<TLayout>>[],
  value,
  onChange,
}: PositionGroupProps<TLayout>) {
  const { alignment, position } = value
  const hasAlignment = alignment !== undefined
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
            <SegmentedControl
              className="position-grid"
              columns={3}
              label={`${label} position`}
              options={getPlacementOptions(hasAlignment)}
              renderOption={renderPlacementMark}
              value={toPlacementKey({ alignment, position })}
              onValueChange={(key) => {
                onChange({ ...value, ...toPlacement(key, hasAlignment) })
              }}
            />
          </DetailsControl>
        </Row>
      ) : null}
      {showsIcons ? (
        <Row layout={isWide ? 'wide' : 'single'}>
          <SegmentedControl
            label={`${label} position`}
            options={positions}
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
