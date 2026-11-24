import { SeparatorVertical, SquareMousePointer } from 'lucide-react'

import Group from '@/shared/ui/Group'
import LayoutControls from '@/shared/ui/LayoutControls'
import NumberFormatControls from '@/shared/ui/NumberFormatControls'
import Row from '@/shared/ui/Row'
import SegmentedControl from '@/shared/ui/SegmentedControl'
import SurfaceControls from '@/shared/ui/SurfaceControls'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type {
  ChartInteractionSpec,
  TooltipAppearance,
  TooltipTrigger,
} from '@/charts/types'
import type { OptionItem } from '@/shared/ui/OptionsMenu'

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
      <Group title="Layout">
        <LayoutControls
          label="Tooltip"
          maxGap={24}
          value={appearance.layout}
          onChange={(layout) => onAppearanceChange({ ...appearance, layout })}
        />
      </Group>
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
        <Group title="Text">
          <TextStyleControls
            label="Tooltip text"
            value={appearance.textStyle}
            onChange={(textStyle) => {
              onAppearanceChange({ ...appearance, textStyle })
            }}
          />
        </Group>
      </SurfaceControls>
      <Group title="Format">
        <NumberFormatControls
          label="Tooltip"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      </Group>
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
