import { Tags } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import SelectControl from '../../shared/ui/SelectControl'
import TextStyleControls from '../../shared/ui/TextStyleControls'
import InspectorWidget from '../InspectorWidget'

import type { LabelPosition, LabelsAppearance } from '../../charts/types'
import type { InspectorWidgetVariant } from '../InspectorWidget'

// ===== TYPES =================================================================
type LabelsWidgetProps = {
  isRadial?: boolean
  onChange: (value: LabelsAppearance) => void
  value: LabelsAppearance
  variant?: InspectorWidgetVariant
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
/** Edits visibility, position and text style of the data labels. */
function LabelsWidget({
  isRadial = false,
  onChange,
  value,
  variant,
}: LabelsWidgetProps) {
  const activePositionOptions = isRadial
    ? radialPositionOptions
    : positionOptions
  return (
    <InspectorWidget
      title="Labels"
      icon={<Tags size={16} />}
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
      variant={variant}
    >
      <TextStyleControls
        label="Label"
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
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
