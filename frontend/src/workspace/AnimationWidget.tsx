import ControlRow from '../shared/ui/ControlRow'
import FormatWidget from '../shared/ui/FormatWidget'
import Slider from '../shared/ui/Slider'

import type { DashboardAnimation } from './types'

type AnimationWidgetProps = {
  value: DashboardAnimation
  onChange: (value: DashboardAnimation) => void
}

/** Edits whether and how long all charts of the dashboard animate. */
function AnimationWidget({ value, onChange }: AnimationWidgetProps) {
  return (
    <FormatWidget
      title="Animation"
      visibility={{
        label: 'Animation',
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
    </FormatWidget>
  )
}

export default AnimationWidget
