import AlignmentControl from '../../shared/ui/AlignmentControl'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, List } from 'lucide-react'

import ColorControl from '../../shared/ui/ColorControl'
import ControlRow from '../../shared/ui/ControlRow'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import Slider from '../../shared/ui/Slider'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import InspectorWidget from '../InspectorWidget'

import type { LegendAppearance } from '../../charts/types'

type LegendWidgetProps = {
  value: LegendAppearance
  onChange: (value: LegendAppearance) => void
}

const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
] satisfies {
  label: string
  value: LegendAppearance['position']
}[]

const positionIcons = {
  top: ArrowUp,
  bottom: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
}

function LegendWidget({ value, onChange }: LegendWidgetProps) {
  return (
    <InspectorWidget
      title="Legend"
      icon={<List size={16} />}
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
    >
      <ControlRow label="Position">
        <SegmentedControl
          label="Legend position"
          renderOption={(option) => {
            const Icon = positionIcons[option.value]
            return <Icon aria-hidden="true" size={15} strokeWidth={2.2} />
          }}
          className="legend-position-control"
          options={positionOptions}
          value={value.position}
          onValueChange={(position) => {
            onChange({ ...value, position })
          }}
        />
      </ControlRow>
      <ControlRow label="Alignment">
        <AlignmentControl
          label="Legend alignment"
          value={value.alignment}
          onValueChange={(alignment) => {
            onChange({ ...value, alignment })
          }}
        />
      </ControlRow>
      <ControlRow label="Text color">
        <ColorControl
          label="Legend text color"
          value={value.textColor}
          onChange={(textColor) => {
            onChange({ ...value, textColor })
          }}
        />
      </ControlRow>
      <ControlRow label="Font size">
        <ScrubbableNumber
          label="Legend font size"
          min={9}
          max={28}
          step={1}
          value={value.fontSize}
          onValueChange={(fontSize) => {
            onChange({ ...value, fontSize })
          }}
        />
      </ControlRow>
      <ControlRow label="Gap">
        <Slider
          label="Legend item gap"
          min={0}
          max={40}
          step={1}
          value={value.gap}
          onValueChange={(gap) => {
            onChange({ ...value, gap })
          }}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default LegendWidget
