import { Type } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import TextInput from '../../ui/TextInput'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type { ChartTitleAppearance } from '../../../types/chart'

type ChartTitleWidgetProps = {
  value: ChartTitleAppearance
  onChange: (value: ChartTitleAppearance) => void
}

function ChartTitleWidget({ value, onChange }: ChartTitleWidgetProps) {
  return (
    <InspectorWidget title="Chart title" icon={<Type size={16} />}>
      <ControlRow label="Enabled">
        <Toggle
          label="Show chart title"
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
          <ControlRow label="Text">
            <TextInput
              label="Chart title"
              value={value.text}
              placeholder="Automatic"
              onValueChange={(text) => {
                onChange({
                  ...value,
                  text,
                })
              }}
            />
          </ControlRow>
        </div>
      ) : null}
    </InspectorWidget>
  )
}

export default ChartTitleWidget
