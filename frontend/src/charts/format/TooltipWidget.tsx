import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import SegmentedControl from '../../shared/ui/SegmentedControl'

import type { ChartInteractionSpec, TooltipTrigger } from '../types'

type TooltipWidgetProps = {
  onChange: (value: ChartInteractionSpec['tooltip']) => void
  showTrigger?: boolean
  value: ChartInteractionSpec['tooltip']
}

const triggerOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Axis', value: 'axis' },
] satisfies { label: string; value: TooltipTrigger }[]

/**
 * Group of the data tooltip: what triggers it. Whether it shows is the
 * element toggle in the popover header; radial charts have no trigger.
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
      <ControlRow label="Trigger">
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
