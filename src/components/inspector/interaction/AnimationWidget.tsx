import { Sparkles } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import Slider from '../../ui/Slider'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type { ChartInteractionSpec } from '../../../types/chart'

type AnimationWidgetProps = {
  value: ChartInteractionSpec['animation']
  onChange: (value: ChartInteractionSpec['animation']) => void
}

function AnimationWidget({ value, onChange }: AnimationWidgetProps) {
  return (
    <InspectorWidget title="Animation" icon={<Sparkles size={16} />}>
      <ControlRow label="Enabled">
        <Toggle
          label="Enable animation"
          checked={value.enabled}
          onCheckedChange={(enabled) => {
            onChange({
              ...value,
              enabled,
            })
          }}
        />
      </ControlRow>

      {value.enabled ? (
        <div className="inspector-widget-subproperties">
          <ControlRow label="Duration">
            <Slider
              label="Animation duration"
              min={0}
              max={2000}
              step={50}
              value={value.duration}
              onValueChange={(duration) => {
                onChange({
                  ...value,
                  duration,
                })
              }}
            />
          </ControlRow>
        </div>
      ) : null}
    </InspectorWidget>
  )
}

export default AnimationWidget
