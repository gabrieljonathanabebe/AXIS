import { PanelBottom, PanelLeft, PanelRight, PanelTop } from 'lucide-react'

import { getPositionLabel, getSideOrientation, isSide } from '@/shared/layout'
import DetailsControl from '../controls/DetailsControl'
import SegmentedControl from '../controls/SegmentedControl'
import BoxRow from '../rows/BoxRow'
import Row from '../rows/Row'
import Group from './Group'
import {
  getPositionOptions,
  toPosition,
  toPositionKey,
} from './positionOptions'

import type { LucideIcon } from 'lucide-react'
import type { PartialPosition, Side } from '@/shared/layout'
import type { OptionItem } from '@/shared/optionItem'
import type { LayoutBox } from '../rows/BoxRow'
import type { GroupHeadProps } from './Group'
import type { PositionKey } from './positionOptions'

// ===== TYPES =================================================================
/** Sides the position allows, e.g. the four sides of a legend. */
type PositionSide<TPosition extends PartialPosition> = NonNullable<
  TPosition['side']
>

type PositionGroupProps<TPosition extends PartialPosition> = GroupHeadProps & {
  box?: LayoutBox
  label: string
  sides?: OptionItem<PositionSide<TPosition>>[]
  value?: TPosition
  onChange?: (value: TPosition) => void
}

// ===== CONSTANTS =============================================================
const sideOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
] satisfies OptionItem<Side>[]

/** Icons of the position field: the side an element sits at. */
const sideIcons = {
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
function renderPositionMark(option: OptionItem<PositionKey>) {
  const { side } = toPosition(option.value, false)
  return (
    <span
      aria-hidden="true"
      className={`position-grid-mark is-${getSideOrientation(side)}`}
    />
  )
}

// ===== COMPONENT =============================================================
/**
 * Rows of the Position group: where an element sits in its parent. A box
 * shows X | Y with the unit and bounds of the element, e.g. grid cells of
 * a container, which has no position of its own. An element at all four
 * sides gets a field that names its place and opens a grid of places
 * around the plot: all eight with an alignment, e.g. of a legend, the
 * cross of the four sides without, e.g. of a color scale. Other sides are
 * an icon group with icon and word, e.g. of the data labels. A single side
 * needs no control.
 * @param props Heading, box, name, allowed sides, position and handler.
 */
function PositionGroup<TPosition extends PartialPosition>({
  box,
  group,
  label,
  sides = sideOptions as OptionItem<PositionSide<TPosition>>[],
  title = 'Position',
  value,
  visibility,
  onChange,
}: PositionGroupProps<TPosition>) {
  const alignment = value?.alignment
  const side = value?.side
  const hasAlignment = alignment !== undefined
  const showsGrid =
    side !== undefined &&
    isSide(side) &&
    sides.length === sideOptions.length &&
    sides.every((option) => isSide(option.value))
  const SideIcon = showsGrid ? sideIcons[side] : null
  const showsIcons = !showsGrid && side !== undefined && sides.length > 1
  const isWide =
    sides.length > MAX_ICONS_PER_COLUMN || sides.some((option) => option.icon)

  /**
   * Saves a changed part of the position, e.g. its side.
   * @param patch Changed fields of the position.
   */
  function changePosition(patch: PartialPosition): void {
    if (value && onChange) {
      onChange({ ...value, ...patch })
    }
  }
  return (
    <Group group={group} title={title} visibility={visibility}>
      {box ? <BoxRow box={box} fields={['x', 'y']} label={label} /> : null}
      {showsGrid && SideIcon ? (
        <Row layout="wide">
          <DetailsControl
            fitsContent
            icon={<SideIcon size={14} />}
            label={`${label} position`}
            text={getPositionLabel(side, alignment)}
          >
            <SegmentedControl
              className="position-grid"
              columns={3}
              label={`${label} position`}
              options={getPositionOptions(hasAlignment)}
              renderOption={renderPositionMark}
              value={toPositionKey({ alignment, side })}
              onValueChange={(key) => {
                changePosition(toPosition(key, hasAlignment))
              }}
            />
          </DetailsControl>
        </Row>
      ) : null}
      {showsIcons ? (
        <Row layout={isWide ? 'wide' : 'single'}>
          <SegmentedControl
            label={`${label} position`}
            options={sides}
            value={side}
            onValueChange={(nextSide) => changePosition({ side: nextSide })}
          />
        </Row>
      ) : null}
    </Group>
  )
}

export default PositionGroup
