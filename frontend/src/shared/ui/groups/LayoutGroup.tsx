import { Fullscreen, MoveHorizontal, MoveVertical, Space } from 'lucide-react'

import { isSide } from '@/shared/layout'
import AlignmentControl from '../controls/AlignmentControl'
import NumberControl from '../controls/NumberControl'
import SegmentedControl from '../controls/SegmentedControl'
import BoxRow from '../rows/BoxRow'
import Row from '../rows/Row'

import type { LucideIcon } from 'lucide-react'
import type { Orientation, PartialLayout } from '@/shared/layout'
import type { OptionItem } from '../primitives/SelectMenu'
import type { LayoutBox } from '../rows/BoxRow'

// ===== TYPES =================================================================
type LayoutGroupProps<TLayout extends PartialLayout> = {
  box?: LayoutBox
  label: string
  maxGap?: number
  maxPadding?: number
  value: TLayout
  onChange: (value: TLayout) => void
}

// ===== CONSTANTS =============================================================
const orientationOptions = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
] satisfies OptionItem<Orientation>[]

const orientationIcons = {
  horizontal: MoveHorizontal,
  vertical: MoveVertical,
} satisfies Record<Orientation, LucideIcon>

// ===== COMPONENT =============================================================
/**
 * Rows of the Layout group: how large an element is and how it spreads
 * its content, in a fixed order: W | H, orientation | alignment, gap |
 * padding. Shows only the fields the layout has, e.g. only padding for a
 * container; `box` adds W | H with the unit and bounds of the element.
 * At a side, orientation and alignment belong to the position, e.g. of a
 * legend, so they show only without one. Reads only its fields, so it
 * takes the same layout as `PositionGroup`.
 */
function LayoutGroup<TLayout extends PartialLayout>({
  box,
  label,
  maxGap = 48,
  maxPadding = 64,
  value,
  onChange,
}: LayoutGroupProps<TLayout>) {
  const { alignment, orientation, position } = value
  const isAtSide = position !== undefined && isSide(position)
  const arrangement = [
    !isAtSide && orientation !== undefined ? (
      <SegmentedControl
        key="orientation"
        label={`${label} orientation`}
        options={orientationOptions}
        renderOption={(option) => {
          const OrientationIcon = orientationIcons[option.value]
          return <OrientationIcon aria-hidden="true" size={16} />
        }}
        value={orientation}
        onValueChange={(nextOrientation) => {
          onChange({ ...value, orientation: nextOrientation })
        }}
      />
    ) : null,
    !isAtSide && alignment !== undefined ? (
      <AlignmentControl
        key="alignment"
        label={`${label} alignment`}
        value={alignment}
        onValueChange={(nextAlignment) => {
          onChange({ ...value, alignment: nextAlignment })
        }}
      />
    ) : null,
  ].filter((control) => control !== null)
  const spacing = [
    value.gap !== undefined ? (
      <NumberControl
        icon={<Space size={14} />}
        key="gap"
        label={`${label} gap`}
        max={maxGap}
        min={0}
        step={2}
        unit="px"
        value={value.gap}
        onValueChange={(gap) => onChange({ ...value, gap })}
      />
    ) : null,
    value.padding !== undefined ? (
      <NumberControl
        icon={<Fullscreen size={14} />}
        key="padding"
        label={`${label} padding`}
        max={maxPadding}
        min={0}
        step={2}
        unit="px"
        value={value.padding}
        onValueChange={(padding) => onChange({ ...value, padding })}
      />
    ) : null,
  ].filter((control) => control !== null)
  return (
    <>
      {box ? (
        <BoxRow box={box} fields={['width', 'height']} label={label} />
      ) : null}
      {arrangement.length > 0 ? <Row>{arrangement}</Row> : null}
      {spacing.length > 0 ? <Row>{spacing}</Row> : null}
    </>
  )
}

export default LayoutGroup
