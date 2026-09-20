import { MessageSquareText } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import SegmentedControl from '../../ui/SegmentedControl'
import Toggle from '../../ui/Toggle'
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
    <InspectorWidget title="Tooltip" icon={<MessageSquareText size={16} />}>
      <ControlRow label="Enabled">
        <Toggle
          label="Show tooltip"
          checked={value.enabled}
          onCheckedChange={(enabled) => {
            onChange({
              ...value,
              enabled,
            })
          }}
        />
      </ControlRow>
      {value.enabled ? (
        <div className="inspector-widget-subproperties">
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
        </div>
      ) : null}
    </InspectorWidget>
  )
}

export default TooltipWidget
