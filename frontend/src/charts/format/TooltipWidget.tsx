import { SeparatorVertical, SquareMousePointer } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import SegmentedControl from '../../shared/ui/SegmentedControl'

import type { OptionItem } from '../../shared/ui/OptionsMenu'
import type { ChartInteractionSpec, TooltipTrigger } from '../types'

type TooltipWidgetProps = {
  onChange: (value: ChartInteractionSpec['tooltip']) => void
  showTrigger?: boolean
  value: ChartInteractionSpec['tooltip']
}

const triggerOptions = [
  { icon: SquareMousePointer, label: 'Item', value: 'item' },
  { icon: SeparatorVertical, label: 'Axis', value: 'axis' },
] satisfies OptionItem<TooltipTrigger>[]

/**
 * Group of the data tooltip: what triggers it, the hovered mark or all
 * marks at one position of the axis. Whether it shows is the eye in the
 * popover header; radial charts have no trigger.
 */
function TooltipWidget({
  onChange,
  showTrigger = true,
  value,
}: TooltipWidgetProps) {
  if (!showTrigger) {
    return null
  }
  return (
    <FormatWidget title="Behavior">
      <ControlRow>
        <SegmentedControl
          label="Tooltip trigger"
          options={triggerOptions}
          value={value.trigger}
          onValueChange={(trigger) => onChange({ ...value, trigger })}
        />
      </ControlRow>
    </FormatWidget>
  )
}

export default TooltipWidget
