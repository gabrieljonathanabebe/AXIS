import { Tags } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type { LabelPosition, LabelsAppearance } from '../../../types/chart'

type LabelsWidgetProps = {
  value: LabelsAppearance
  onChange: (value: LabelsAppearance) => void
}

const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Inside', value: 'inside' },
] satisfies { label: string; value: LabelPosition }[]

function LabelsWidget({ value, onChange }: LabelsWidgetProps) {
  return (
    <InspectorWidget title="Labels" icon={<Tags size={16} />}>
      <ControlRow label="Enabled">
        <Toggle
          label="Show data labels"
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
          <ControlRow label="Position">
            <SelectControl
              label="Label position"
              options={positionOptions}
              value={value.position}
              onChange={(position) => {
                onChange({
                  ...value,
                  position,
                })
              }}
            />
          </ControlRow>
        </div>
      ) : null}
    </InspectorWidget>
  )
}

export default LabelsWidget
