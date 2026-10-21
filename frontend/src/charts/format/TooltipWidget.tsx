import ControlRow from '../../shared/ui/ControlRow'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import FormatWidget from '../../shared/ui/FormatWidget'

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

/** Edits whether the data tooltip shows and what triggers it. */
function TooltipWidget({
  onChange,
  showTrigger = true,
  value,
}: TooltipWidgetProps) {
  return (
    <FormatWidget
      title="Tooltip"
      visibility={{
        label: 'Enabled',
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
    >
      {showTrigger ? (
        <ControlRow label="Trigger">
          <SegmentedControl
            label="Tooltip trigger"
            options={triggerOptions}
            value={value.trigger}
            onValueChange={(trigger) => {
              onChange({
                ...value,
                trigger,
              })
            }}
          />
        </ControlRow>
      ) : null}
    </FormatWidget>
  )
}

export default TooltipWidget
