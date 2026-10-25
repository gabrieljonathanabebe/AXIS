import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import GradientControl from '../../shared/ui/GradientControl'
import LayoutControls from '../../shared/ui/LayoutControls'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import Toggle from '../../shared/ui/Toggle'

import type { ColorScaleAppearance } from '../types'

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
  value: ContinuousColorScale['layout']['position']
}[]

/**
 * Groups of the continuous color scale: its value range, where it sits,
 * its colors and its labels. Whether it shows is the element toggle in
 * the popover header.
 */
function ColorScaleWidget({ value, onChange }: ColorScaleWidgetProps) {
  return (
    <>
      <FormatWidget title="Range">
        <ControlRow label="Min auto">
          <Toggle
            label="Use automatic color scale minimum"
            checked={value.min === null}
            onCheckedChange={(automatic) => {
              onChange({ ...value, min: automatic ? null : 0 })
            }}
          />
        </ControlRow>
        {value.min !== null ? (
          <div className="format-widget-subproperties">
            <ControlRow label="Minimum">
              <ScrubbableNumber
                label="Color scale minimum"
                step={1}
                value={value.min}
                onValueChange={(min) => onChange({ ...value, min })}
              />
            </ControlRow>
          </div>
        ) : null}
        <ControlRow label="Max auto">
          <Toggle
            label="Use automatic color scale maximum"
            checked={value.max === null}
            onCheckedChange={(automatic) => {
              onChange({ ...value, max: automatic ? null : 100 })
            }}
          />
        </ControlRow>
        {value.max !== null ? (
          <div className="format-widget-subproperties">
            <ControlRow label="Maximum">
              <ScrubbableNumber
                label="Color scale maximum"
                step={1}
                value={value.max}
                onValueChange={(max) => onChange({ ...value, max })}
              />
            </ControlRow>
          </div>
        ) : null}
      </FormatWidget>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Color scale"
          positions={positionOptions}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <FormatWidget title="Colors">
        <ControlRow label="Gradient">
          <GradientControl
            label="Color scale"
            startColor={value.startColor}
            endColor={value.endColor}
            onChange={({ startColor, endColor }) => {
              onChange({ ...value, startColor, endColor })
            }}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget
        title="Labels"
        visibility={{
          visible: value.labels,
          onChange: (labels) => onChange({ ...value, labels }),
        }}
      />
    </>
  )
}

export default ColorScaleWidget
