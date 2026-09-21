import { Type } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import TextInput from '../../ui/TextInput'
import InspectorWidget from '../InspectorWidget'

import type { ChartTitleAppearance } from '../../../types/chart'

type ChartTitleWidgetProps = {
  value: ChartTitleAppearance
  onChange: (value: ChartTitleAppearance) => void
}

function ChartTitleWidget({ value, onChange }: ChartTitleWidgetProps) {
  return (
    <InspectorWidget
      title="Title"
      icon={<Type size={16} />}
      visibility={{
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
    >
      <ControlRow label="Text">
        <TextInput
          label="Title"
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
    </InspectorWidget>
  )
}

export default ChartTitleWidget
