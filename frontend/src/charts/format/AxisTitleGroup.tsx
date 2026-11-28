import { getVisibility } from '@/shared/ui/groups/getVisibility'
import TextGroup from '@/shared/ui/groups/TextGroup'
import TextInput from '@/shared/ui/primitives/TextInput'
import Row from '@/shared/ui/rows/Row'

import type { AxisTitleAppearance } from '@/charts/types'

// ===== TYPES =================================================================
type AxisTitleGroupProps = {
  defaultTitle?: string
  /** Element whose click opens the group, e.g. the title of a color scale. */
  group?: string
  /** Name of the element in the control labels, e.g. "X Axis". */
  label: string
  value: AxisTitleAppearance
  onChange: (value: AxisTitleAppearance) => void
}

// ===== COMPONENT =============================================================
/**
 * Title group of an axis or the color scale: its text and style, with an
 * eye that hides the title. Without a text it shows the default, e.g. the
 * name of the field.
 * @param props Title, its default, element, name and handler.
 */
function AxisTitleGroup({
  defaultTitle,
  group,
  label,
  value,
  onChange,
}: AxisTitleGroupProps) {
  return (
    <TextGroup
      group={group}
      label={`${label} title`}
      title="Title"
      value={value.textStyle}
      visibility={getVisibility(value, onChange)}
      onChange={(textStyle) => onChange({ ...value, textStyle })}
    >
      <Row layout="wide">
        <TextInput
          label={`${label} title`}
          value={value.text}
          placeholder={defaultTitle || 'Automatic'}
          onValueChange={(text) => onChange({ ...value, text })}
        />
      </Row>
    </TextGroup>
  )
}

export default AxisTitleGroup
