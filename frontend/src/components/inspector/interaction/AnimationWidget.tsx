import { Sparkles } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import Slider from '../../ui/Slider'
import InspectorWidget from '../InspectorWidget'

import type { ChartInteractionSpec } from '../../../types/chart'

type AnimationWidgetProps = {
  value: ChartInteractionSpec['animation']
  onChange: (value: ChartInteractionSpec['animation']) => void
}

function AnimationWidget({ value, onChange }: AnimationWidgetProps) {
  return (
    <InspectorWidget
      title="Animation"
      icon={<Sparkles size={16} />}
      visibility={{
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
    >
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
    </InspectorWidget>
  )
}

export default AnimationWidget
