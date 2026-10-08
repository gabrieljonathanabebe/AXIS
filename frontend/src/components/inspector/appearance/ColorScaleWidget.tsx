import {
  ArrowLeft,
  ArrowRight,
  MoveHorizontal,
  MoveVertical,
  Palette,
} from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import GradientControl from '../../ui/GradientControl'
import InspectorWidget from '../InspectorWidget'
import ScrubbableNumber from '../../ui/ScrubbableNumber'
import SegmentedControl from '../../ui/SegmentedControl'
import Toggle from '../../ui/Toggle'

import type { ColorScaleAppearance } from '../../../types/chart'

type ContinuousColorScale = ColorScaleAppearance['continuous']

type ColorScaleWidgetProps = {
  value: ContinuousColorScale
  onChange: (value: ContinuousColorScale) => void
}

const positionOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
] satisfies {
  label: string
  value: ContinuousColorScale['position']
}[]

const positionIcons = {
  left: ArrowLeft,
  right: ArrowRight,
}

const orientationOptions = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
] satisfies {
  label: string
  value: ContinuousColorScale['orientation']
}[]

const orientationIcons = {
  vertical: MoveVertical,
  horizontal: MoveHorizontal,
}

function ColorScaleWidget({ value, onChange }: ColorScaleWidgetProps) {
  return (
    <InspectorWidget
      title="Color Scale"
      icon={<Palette size={16} />}
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
    >
      <ControlRow label="Colors">
        <GradientControl
          label="Color scale"
          startColor={value.startColor}
          endColor={value.endColor}
          onChange={({ startColor, endColor }) => {
            onChange({
              ...value,
              startColor,
              endColor,
            })
          }}
        />
      </ControlRow>
      <ControlRow label="Min auto">
        <Toggle
          label="Use automatic color scale minimum"
          checked={value.min === null}
          onCheckedChange={(automatic) => {
            onChange({
              ...value,
              min: automatic ? null : 0,
            })
          }}
        />
      </ControlRow>
      {value.min !== null ? (
        <div className="inspector-widget-subproperties">
          <ControlRow label="Minimum">
            <ScrubbableNumber
              label="Color scale minimum"
              step={1}
              value={value.min}
              onValueChange={(min) => {
                onChange({ ...value, min })
              }}
            />
          </ControlRow>
        </div>
      ) : null}
      <ControlRow label="Max auto">
        <Toggle
          label="Use automatic color scale maximum"
          checked={value.max === null}
          onCheckedChange={(automatic) => {
            onChange({
              ...value,
              max: automatic ? null : 100,
            })
          }}
        />
      </ControlRow>
      {value.max !== null ? (
        <div className="inspector-widget-subproperties">
          <ControlRow label="Maximum">
            <ScrubbableNumber
              label="Color scale maximum"
              step={1}
              value={value.max}
              onValueChange={(max) => {
                onChange({ ...value, max })
              }}
            />
          </ControlRow>
        </div>
      ) : null}
      <ControlRow label="Labels">
        <Toggle
          label="Show color scale labels"
          checked={value.labels}
          onCheckedChange={(labels) => {
            onChange({ ...value, labels })
          }}
        />
      </ControlRow>
      <ControlRow label="Position">
        <SegmentedControl
          label="Color scale position"
          options={positionOptions}
          value={value.position}
          renderOption={(option) => {
            const Icon = positionIcons[option.value]
            return <Icon aria-hidden="true" size={16} />
          }}
          onValueChange={(position) => {
            onChange({ ...value, position })
          }}
        />
      </ControlRow>
      <ControlRow label="Orientation">
        <SegmentedControl
          label="Color scale orientation"
          options={orientationOptions}
          value={value.orientation}
          renderOption={(option) => {
            const Icon = orientationIcons[option.value]
            return <Icon aria-hidden="true" size={16} />
          }}
          onValueChange={(orientation) => {
            onChange({ ...value, orientation })
          }}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default ColorScaleWidget
