import ControlRow from '../shared/ui/ControlRow'
import FormatWidget from '../shared/ui/FormatWidget'
import TextInput from '../shared/ui/TextInput'
import TextStyleControls from '../shared/ui/TextStyleControls'
import { TITLE_TEXT_STYLE } from './objectDefaults'

import type { ObjectTitleAppearance } from './types'

type ObjectTitleWidgetProps = {
  defaultTitle?: string
  value: ObjectTitleAppearance
  onChange: (value: ObjectTitleAppearance) => void
}

/**
 * Groups of an object title: its text and its text style with the
 * alignment. Whether the title shows is the element toggle in the popover
 * header.
 */
function ObjectTitleWidget({
  defaultTitle,
  value,
  onChange,
}: ObjectTitleWidgetProps) {
  return (
    <>
      <FormatWidget title="Content">
        <ControlRow label="Text">
          <TextInput
            label="Title"
            value={value.text}
            placeholder={defaultTitle || 'Automatic'}
            onValueChange={(text) => onChange({ ...value, text })}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Text">
        <TextStyleControls
          alignment={{
            value: value.layout.alignment,
            onChange: (alignment) => {
              onChange({ ...value, layout: { ...value.layout, alignment } })
            },
          }}
          defaultColor={TITLE_TEXT_STYLE.color}
          label="Title"
          maxFontSize={20}
          minFontSize={11}
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </FormatWidget>
    </>
  )
}

export default ObjectTitleWidget
