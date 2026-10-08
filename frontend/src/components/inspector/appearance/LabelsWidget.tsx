import { Tags } from 'lucide-react'

import ColorControl from '../../../shared/ui/ColorControl'
import ControlRow from '../../../shared/ui/ControlRow'
import FontWeightControl from '../../../shared/ui/FontWeightControl'
import ScrubbableNumber from '../../../shared/ui/ScrubbableNumber'
import SelectControl from '../../../shared/ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { LabelPosition, LabelsAppearance } from '../../../types/chart'

// ===== TYPES =================================================================
type LabelsWidgetProps = {
  isRadial?: boolean
  onChange: (value: LabelsAppearance) => void
  value: LabelsAppearance
}

// ===== CONSTANTS =============================================================
const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Inside', value: 'inside' },
] satisfies { label: string; value: LabelPosition }[]

const radialPositionOptions = [
  { label: 'Outside', value: 'right' },
  { label: 'Inside', value: 'inside' },
] satisfies { label: string; value: LabelPosition }[]

// ===== COMPONENT =============================================================
function LabelsWidget({
  isRadial = false,
  onChange,
  value,
}: LabelsWidgetProps) {
  const activePositionOptions = isRadial
    ? radialPositionOptions
    : positionOptions
  return (
    <InspectorWidget
      title="Labels"
      icon={<Tags size={16} />}
      visibility={{
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
    >
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
        <FontWeightControl
          label="Label font weight"
          value={value.fontWeight}
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
          options={activePositionOptions}
          value={value.position}
          onChange={(position) => {
            onChange({
              ...value,
              position,
            })
          }}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default LabelsWidget
