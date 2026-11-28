import { SeparatorVertical, SquareMousePointer } from 'lucide-react'

import SegmentedControl from '@/shared/ui/controls/SegmentedControl'
import BackgroundGroup from '@/shared/ui/groups/BackgroundGroup'
import BorderGroup from '@/shared/ui/groups/BorderGroup'
import EffectsGroup from '@/shared/ui/groups/EffectsGroup'
import Group from '@/shared/ui/groups/Group'
import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import NumberFormatGroup from '@/shared/ui/groups/NumberFormatGroup'
import ShapeGroup from '@/shared/ui/groups/ShapeGroup'
import TextGroup from '@/shared/ui/groups/TextGroup'
import Row from '@/shared/ui/rows/Row'

import type {
  ChartInteractionSpec,
  TooltipAppearance,
  TooltipTrigger,
} from '@/charts/types'
import type { OptionItem } from '@/shared/optionItem'
import type { Surface } from '@/shared/surface'

type TooltipGroupProps = {
  appearance: TooltipAppearance
  onAppearanceChange: (value: TooltipAppearance) => void
  onChange: (value: ChartInteractionSpec['tooltip']) => void
  showTrigger?: boolean
  value: ChartInteractionSpec['tooltip']
}

const triggerOptions = [
  { icon: SquareMousePointer, label: 'Item', value: 'item' },
  { icon: SeparatorVertical, label: 'Axis', value: 'axis' },
] satisfies OptionItem<TooltipTrigger>[]

/**
 * Group of the data tooltip in the marks with its subgroups in the fixed
 * order: its padding and the gap between its rows, its surface as CSS (no
 * gradient in the border, no grain) with its text after Shape, the number
 * format of its values, then what triggers it, the hovered mark or all
 * marks at one position of the axis. Its eye turns the tooltip on or off;
 * radial charts have no trigger.
 */
function TooltipGroup({
  appearance,
  onAppearanceChange,
  onChange,
  showTrigger = true,
  value,
}: TooltipGroupProps) {
  const { surface } = appearance

  /** Saves changed parts of the surface, e.g. its border. */
  function setSurface(patch: Partial<Surface>): void {
    onAppearanceChange({ ...appearance, surface: { ...surface, ...patch } })
  }

  return (
    <Group
      group="tooltip"
      title="Tooltip"
      visibility={{
        visible: value.enabled,
        onChange: (enabled) => onChange({ ...value, enabled }),
      }}
    >
      <LayoutGroup
        label="Tooltip"
        maxGap={24}
        value={appearance.layout}
        onChange={(layout) => onAppearanceChange({ ...appearance, layout })}
      />
      <ShapeGroup
        label="Tooltip"
        value={surface.borderRadius}
        onChange={(borderRadius) => setSurface({ borderRadius })}
      />
      <TextGroup
        label="Tooltip text"
        value={appearance.textStyle}
        onChange={(textStyle) =>
          onAppearanceChange({ ...appearance, textStyle })
        }
      />
      <BackgroundGroup
        label="Tooltip"
        value={surface.background}
        onChange={(background) => setSurface({ background })}
      />
      <BorderGroup
        label="Tooltip"
        renderer="css"
        value={surface.border}
        onChange={(border) => setSurface({ border })}
      />
      <EffectsGroup
        label="Tooltip"
        renderer="css"
        value={surface.effects}
        onChange={(effects) => setSurface({ effects })}
      />
      <NumberFormatGroup
        label="Tooltip"
        value={value.numberFormat}
        onChange={(numberFormat) => onChange({ ...value, numberFormat })}
      />
      {showTrigger ? (
        <Group title="Behavior">
          <Row layout="wide">
            <SegmentedControl
              label="Tooltip trigger"
              options={triggerOptions}
              value={value.trigger}
              onValueChange={(trigger) => onChange({ ...value, trigger })}
            />
          </Row>
        </Group>
      ) : null}
    </Group>
  )
}

export default TooltipGroup
