import { Tags } from 'lucide-react'

import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import ScrubbableNumber from '../../ui/ScrubbableNumber'
import SegmentedControl from '../../ui/SegmentedControl'
import SelectControl from '../../ui/SelectControl'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type {
  LabelFontWeight,
  LabelPosition,
  LabelsAppearance,
} from '../../../types/chart'

type LabelsWidgetProps = {
  value: LabelsAppearance
  onChange: (value: LabelsAppearance) => void
}

const fontWeightOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Bold', value: 'bold' },
] satisfies { label: string; value: LabelFontWeight }[]

const fontWeightValues = {
  light: 300,
  medium: 500,
  bold: 700,
} satisfies Record<LabelFontWeight, number>

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
          <ControlRow label="Color">
            <ColorControl
              label="Label color"
              value={value.color}
              onChange={(color) => {
                onChange({
                  ...value,
                  color,
                })
              }}
            />
          </ControlRow>
          <ControlRow label="Font size">
            <ScrubbableNumber
              label="Label font size"
              min={9}
              max={28}
              step={1}
              value={value.fontSize}
              onValueChange={(fontSize) => {
                onChange({
                  ...value,
                  fontSize,
                })
              }}
            />
          </ControlRow>
          <ControlRow label="Weight">
            <SegmentedControl
              label="Label font weight"
              options={fontWeightOptions}
              value={value.fontWeight}
              renderOption={(option) => (
                <span
                  aria-hidden="true"
                  style={{
                    fontWeight: fontWeightValues[option.value],
                  }}
                >
                  A
                </span>
              )}
              onValueChange={(fontWeight) => {
                onChange({
                  ...value,
                  fontWeight,
                })
              }}
            />
          </ControlRow>
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
