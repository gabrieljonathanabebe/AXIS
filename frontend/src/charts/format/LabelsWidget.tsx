import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import NumberFormatControls from '../../shared/ui/NumberFormatControls'
import SelectControl from '../../shared/ui/SelectControl'
import TextStyleControls from '../../shared/ui/TextStyleControls'

import type { LabelPosition, LabelsAppearance } from '../types'

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
/** Edits visibility, number format, text style and position of the data labels. */
function LabelsWidget({
  isRadial = false,
  onChange,
  value,
}: LabelsWidgetProps) {
  const activePositionOptions = isRadial
    ? radialPositionOptions
    : positionOptions
  return (
    <FormatWidget
      title="Labels"
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
    >
      {!isRadial ? (
        <NumberFormatControls
          label="Label"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      ) : null}
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
    </FormatWidget>
  )
}

export default LabelsWidget
