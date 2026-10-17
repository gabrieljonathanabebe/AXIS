import { Type } from 'lucide-react'

import AlignmentControl from '../../shared/ui/AlignmentControl'
import ControlRow from '../../shared/ui/ControlRow'
import TextInput from '../../shared/ui/TextInput'
import TextStyleControls from '../../shared/ui/TextStyleControls'
import InspectorWidget from '../InspectorWidget'

import type { InspectorWidgetVariant } from '../InspectorWidget'
import type { ObjectTitleAppearance } from '../../objects/types'

type ChartTitleWidgetProps = {
  defaultTitle?: string
  value: ObjectTitleAppearance
  onChange: (value: ObjectTitleAppearance) => void
  variant?: InspectorWidgetVariant
}

function ChartTitleWidget({
  defaultTitle,
  value,
  onChange,
  variant,
}: ChartTitleWidgetProps) {
  return (
    <InspectorWidget
      title="Title"
      icon={<Type size={16} />}
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
      variant={variant}
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
    </InspectorWidget>
  )
}

export default ChartTitleWidget
