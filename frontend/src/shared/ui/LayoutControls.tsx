import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Fullscreen,
  MoveHorizontal,
  MoveVertical,
  Space,
} from 'lucide-react'

import { isSide } from '../layout'
import AlignmentControl from './AlignmentControl'
import ControlRow from './ControlRow'
import PositionGrid from './PositionGrid'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Layout, Orientation, Side } from '../layout'
import type { OptionItem } from './OptionsMenu'

// ===== TYPES =================================================================
/** Any part of a layout, e.g. only the alignment of a title. */
type PartialLayout = Partial<Layout<string>>

/** Positions the layout allows, e.g. the four sides of a legend. */
type LayoutPosition<TLayout extends PartialLayout> = NonNullable<
  TLayout['position']
>

type LayoutControlsProps<TLayout extends PartialLayout> = {
  label: string
  maxGap?: number
  maxPadding?: number
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

const orientationOptions = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
] satisfies OptionItem<Orientation>[]

const orientationIcons = {
  horizontal: MoveHorizontal,
  vertical: MoveVertical,
} satisfies Record<Orientation, LucideIcon>

// ===== HELPERS ===============================================================
/**
 * Pairs controls into rows of two, the columns of a compact row.
 * @param controls Controls in their order.
 * @returns The controls two by two.
 */
function pairControls(controls: ReactNode[]): ReactNode[][] {
  const rows: ReactNode[][] = []
  for (let index = 0; index < controls.length; index += 2) {
    rows.push(controls.slice(index, index + 2))
  }
  return rows
}

// ===== COMPONENT =============================================================
/**
 * Compact rows for position, orientation, alignment, gap and padding of one
 * element, two controls per row. Shows only the fields the layout has, e.g.
 * only padding for a container. A layout with a side and an alignment, e.g.
 * a legend, places both in a `PositionGrid`; other positions are an icon
 * group showing the icon of each option, by default arrows for sides. A
 * single position needs no control.
 */
function LayoutControls<TLayout extends PartialLayout>({
  label,
  maxGap = 48,
  maxPadding = 64,
  positions = sideOptions as OptionItem<LayoutPosition<TLayout>>[],
  value,
  onChange,
}: LayoutControlsProps<TLayout>) {
  const { alignment, position } = value
  const showsGrid =
    alignment !== undefined && position !== undefined && isSide(position)
  const controls = [
    showsGrid ? (
      <PositionGrid
        key="grid"
        label={`${label} position`}
        value={{ alignment, position }}
        onChange={(placement) => onChange({ ...value, ...placement })}
      />
    ) : null,
    !showsGrid && position !== undefined && positions.length > 1 ? (
      <SegmentedControl
        className="layout-position-control"
        key="position"
        label={`${label} position`}
        options={positions}
        renderOption={(option) => {
          const PositionIcon =
            option.icon ??
            (isSide(option.value) ? sideIcons[option.value] : null)
          return PositionIcon ? (
            <PositionIcon aria-hidden="true" size={15} />
          ) : (
            option.label
          )
        }}
        value={position}
        onValueChange={(nextPosition) => {
          onChange({ ...value, position: nextPosition })
        }}
      />
    ) : null,
    value.orientation !== undefined ? (
      <SegmentedControl
        key="orientation"
        label={`${label} orientation`}
        options={orientationOptions}
        renderOption={(option) => {
          const OrientationIcon = orientationIcons[option.value]
          return <OrientationIcon aria-hidden="true" size={16} />
        }}
        value={value.orientation}
        onValueChange={(orientation) => onChange({ ...value, orientation })}
      />
    ) : null,
    !showsGrid && alignment !== undefined ? (
      <AlignmentControl
        key="alignment"
        label={`${label} alignment`}
        value={alignment}
        onValueChange={(nextAlignment) => {
          onChange({ ...value, alignment: nextAlignment })
        }}
      />
    ) : null,
    value.gap !== undefined ? (
      <ScrubbableNumber
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
      <ScrubbableNumber
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
      {pairControls(controls).map((row, index) => (
        <ControlRow key={index}>{row}</ControlRow>
      ))}
    </>
  )
}

export default LayoutControls
