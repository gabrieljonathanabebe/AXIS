import Group from '@/shared/ui/Group'
import Row from '@/shared/ui/Row'
import TextInput from '@/shared/ui/TextInput'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type { ObjectTitleAppearance } from './types'

type ObjectTitleWidgetProps = {
  defaultTitle?: string
  value: ObjectTitleAppearance
  onChange: (value: ObjectTitleAppearance) => void
}

/**
 * Groups of an object title: its text and its text style with the
 * alignment. Whether the title shows is the eye in the popover header.
 */
function ObjectTitleWidget({
  defaultTitle,
  value,
  onChange,
}: ObjectTitleWidgetProps) {
  return (
    <>
      <Group title="Content">
        <Row layout="wide">
          <TextInput
            label="Title"
            value={value.text}
            placeholder={defaultTitle || 'Automatic'}
            onValueChange={(text) => onChange({ ...value, text })}
          />
        </Row>
      </Group>
      <Group title="Text">
        <TextStyleControls
          alignment={{
            value: value.layout.alignment,
            onChange: (alignment) => {
              onChange({ ...value, layout: { ...value.layout, alignment } })
            },
          }}
          label="Title"
          maxFontSize={20}
          minFontSize={11}
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </Group>
    </>
  )
}

export default ObjectTitleWidget
