import { SeparatorVertical, SquareMousePointer } from 'lucide-react'

import SegmentedControl from '@/shared/ui/controls/SegmentedControl'
import Group from '@/shared/ui/groups/Group'
import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import NumberFormatGroup from '@/shared/ui/groups/NumberFormatGroup'
import SurfaceControls from '@/shared/ui/groups/SurfaceControls'
import TextGroup from '@/shared/ui/groups/TextGroup'
import Row from '@/shared/ui/rows/Row'

import type {
  ChartInteractionSpec,
  TooltipAppearance,
  TooltipTrigger,
} from '@/charts/types'
import type { OptionItem } from '@/shared/optionItem'

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
      <SurfaceControls
        label="Tooltip"
        renderer="css"
        value={appearance.surface}
        onChange={(key, property) => {
          onAppearanceChange({
            ...appearance,
            surface: { ...appearance.surface, [key]: property },
          })
        }}
      >
        <TextGroup
          label="Tooltip text"
          value={appearance.textStyle}
          onChange={(textStyle) => {
            onAppearanceChange({ ...appearance, textStyle })
          }}
        />
      </SurfaceControls>
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
