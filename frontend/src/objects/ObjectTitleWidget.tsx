import AlignmentControl from '../shared/ui/AlignmentControl'
import ControlRow from '../shared/ui/ControlRow'
import TextInput from '../shared/ui/TextInput'
import TextStyleControls from '../shared/ui/TextStyleControls'
import FormatWidget from '../shared/ui/FormatWidget'

import type { ObjectTitleAppearance } from './types'

type ObjectTitleWidgetProps = {
  defaultTitle?: string
  value: ObjectTitleAppearance
  onChange: (value: ObjectTitleAppearance) => void
}

function ObjectTitleWidget({
  defaultTitle,
  value,
  onChange,
}: ObjectTitleWidgetProps) {
  return (
    <FormatWidget
      title="Title"
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
    >
      <ControlRow label="Text">
        <TextInput
          label="Title"
          value={value.text}
          placeholder={defaultTitle || 'Automatic'}
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
      <TextStyleControls
        label="Title"
        maxFontSize={20}
        minFontSize={11}
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
    </FormatWidget>
  )
}

export default ObjectTitleWidget
