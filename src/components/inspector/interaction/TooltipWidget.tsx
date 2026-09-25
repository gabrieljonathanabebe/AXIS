import { MessageSquareText } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import SegmentedControl from '../../ui/SegmentedControl'
import InspectorWidget from '../InspectorWidget'

import type { ChartInteractionSpec, TooltipTrigger } from '../../../types/chart'

type TooltipWidgetProps = {
  onChange: (value: ChartInteractionSpec['tooltip']) => void
  showTrigger?: boolean
  value: ChartInteractionSpec['tooltip']
}

const triggerOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Axis', value: 'axis' },
] satisfies { label: string; value: TooltipTrigger }[]

function TooltipWidget({
  onChange,
  showTrigger = true,
  value,
}: TooltipWidgetProps) {
  return (
    <InspectorWidget
      title="Tooltip"
      icon={<MessageSquareText size={16} />}
      visibility={{
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
    </InspectorWidget>
  )
}

export default TooltipWidget
