import Group from '@/shared/ui/groups/Group'
import TextStyleControls from '@/shared/ui/groups/TextStyleControls'
import TextInput from '@/shared/ui/primitives/TextInput'
import Row from '@/shared/ui/rows/Row'

import type { ObjectTitleAppearance } from './types'

type TitleElementProps = {
  defaultTitle?: string
  value: ObjectTitleAppearance
  onChange: (value: ObjectTitleAppearance) => void
}

/**
 * Groups of an object title: its text and its text style with the
 * alignment. Whether the title shows is the eye in the popover header.
 */
function TitleElement({ defaultTitle, value, onChange }: TitleElementProps) {
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

export default TitleElement
