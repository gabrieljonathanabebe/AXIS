import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  MoveHorizontal,
  MoveVertical,
} from 'lucide-react'

import { isSide } from '../layout'
import AlignmentControl from './AlignmentControl'
import ControlRow from './ControlRow'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { LucideIcon } from 'lucide-react'
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

// ===== COMPONENT =============================================================
/**
 * Rows for position, orientation, alignment, gap and padding of one
 * element. Shows only the rows whose fields the layout has, e.g. only
 * Alignment for a title. Positions default to the four sides; sides show
 * as arrows, other positions such as "Inside" as text.
 */
function LayoutControls<TLayout extends PartialLayout>({
  label,
  maxGap = 48,
  maxPadding = 64,
  positions = sideOptions as OptionItem<LayoutPosition<TLayout>>[],
  value,
  onChange,
}: LayoutControlsProps<TLayout>) {
  const showsSideIcons = positions.every((option) => isSide(option.value))
  return (
    <>
      {value.position !== undefined ? (
        <ControlRow label="Position">
          <SegmentedControl
            className="layout-position-control"
            label={`${label} position`}
            options={positions}
            renderOption={(option) => {
              if (!showsSideIcons || !isSide(option.value)) {
                return option.label
              }
              const SideIcon = sideIcons[option.value]
              return <SideIcon aria-hidden="true" size={15} />
            }}
            value={value.position}
            onValueChange={(position) => onChange({ ...value, position })}
          />
        </ControlRow>
      ) : null}
      {value.orientation !== undefined ? (
        <ControlRow label="Orientation">
          <SegmentedControl
            label={`${label} orientation`}
            options={orientationOptions}
            renderOption={(option) => {
              const OrientationIcon = orientationIcons[option.value]
              return <OrientationIcon aria-hidden="true" size={16} />
            }}
            value={value.orientation}
            onValueChange={(orientation) => onChange({ ...value, orientation })}
          />
        </ControlRow>
      ) : null}
      {value.alignment !== undefined ? (
        <ControlRow label="Alignment">
          <AlignmentControl
            label={`${label} alignment`}
            value={value.alignment}
            onValueChange={(alignment) => onChange({ ...value, alignment })}
          />
        </ControlRow>
      ) : null}
      {value.gap !== undefined ? (
        <ControlRow label="Gap">
          <ScrubbableNumber
            label={`${label} gap`}
            max={maxGap}
            min={0}
            step={2}
            value={value.gap}
            onValueChange={(gap) => onChange({ ...value, gap })}
          />
        </ControlRow>
      ) : null}
      {value.padding !== undefined ? (
        <ControlRow label="Padding">
          <ScrubbableNumber
            label={`${label} padding`}
            max={maxPadding}
            min={0}
            step={2}
            value={value.padding}
            onValueChange={(padding) => onChange({ ...value, padding })}
          />
        </ControlRow>
      ) : null}
    </>
  )
}

export default LayoutControls
