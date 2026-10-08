import { Type } from 'lucide-react'

import AlignmentControl from '../../../shared/ui/AlignmentControl'
import ControlRow from '../../../shared/ui/ControlRow'
import TextInput from '../../../shared/ui/TextInput'
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
      <ControlRow label="Alignment">
        <AlignmentControl
          label="Title alignment"
          value={value.alignment}
          onValueChange={(alignment) => {
            onChange({ ...value, alignment })
          }}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default ChartTitleWidget
