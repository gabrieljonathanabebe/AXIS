import { MessageSquareText } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import SegmentedControl from '../../ui/SegmentedControl'
import InspectorWidget from '../InspectorWidget'

import type { ChartInteractionSpec, TooltipTrigger } from '../../../types/chart'

type TooltipWidgetProps = {
  value: ChartInteractionSpec['tooltip']
  onChange: (value: ChartInteractionSpec['tooltip']) => void
}

const triggerOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Axis', value: 'axis' },
] satisfies { label: string; value: TooltipTrigger }[]

function TooltipWidget({ value, onChange }: TooltipWidgetProps) {
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
    </InspectorWidget>
  )
}

export default TooltipWidget
