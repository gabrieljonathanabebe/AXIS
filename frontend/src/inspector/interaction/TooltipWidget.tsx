import { MessageSquareText } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import InspectorWidget from '../InspectorWidget'

import type { ChartInteractionSpec, TooltipTrigger } from '../../charts/types'
import type { InspectorWidgetVariant } from '../InspectorWidget'

type TooltipWidgetProps = {
  onChange: (value: ChartInteractionSpec['tooltip']) => void
  showTrigger?: boolean
  value: ChartInteractionSpec['tooltip']
  variant?: InspectorWidgetVariant
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
  variant,
}: TooltipWidgetProps) {
  return (
    <InspectorWidget
      title="Tooltip"
      icon={<MessageSquareText size={16} />}
      visibility={{
        label: 'Enabled',
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
      variant={variant}
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
