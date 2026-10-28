import { Minus, Timer } from 'lucide-react'

import ControlRow from '../shared/ui/ControlRow'
import FormatWidget from '../shared/ui/FormatWidget'
import IconButton from '../shared/ui/IconButton'
import ScrubbableNumber from '../shared/ui/ScrubbableNumber'
import SelectControl from '../shared/ui/SelectControl'
import { DASHBOARD_ANIMATION } from './workspaceReducer'

import type { OptionItem } from '../shared/ui/OptionsMenu'
import type { AnimationEasing, DashboardAnimation } from './types'

type AnimationWidgetProps = {
  value: DashboardAnimation
  onChange: (value: DashboardAnimation) => void
}

/** Speed curves, named like CSS easings instead of the ECharts names. */
const easingOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Ease out', value: 'cubicOut' },
  { label: 'Ease in-out', value: 'cubicInOut' },
] satisfies OptionItem<AnimationEasing>[]

/**
 * Animation group of the dashboard: without animation only the plus in its
 * heading, which adds the default animation, else the row with the speed
 * curve and duration of all chart animations and a minus that removes it.
 */
function AnimationWidget({ value, onChange }: AnimationWidgetProps) {
  if (!value.enabled) {
    return (
      <FormatWidget
        title="Animation"
        onAdd={() => onChange(DASHBOARD_ANIMATION)}
      />
    )
  }
  return (
    <FormatWidget title="Animation">
      <ControlRow>
        <SelectControl
          label="Animation easing"
          options={easingOptions}
          value={value.easing}
          onChange={(easing) => onChange({ ...value, easing })}
        />
        <ScrubbableNumber
          icon={<Timer size={14} />}
          label="Animation duration"
          max={2000}
          min={0}
          step={50}
          unit="ms"
          value={value.duration}
          onValueChange={(duration) => onChange({ ...value, duration })}
        />
        <IconButton
          label="Remove animation"
          size="sm"
          variant="ghost"
          onClick={() => onChange({ ...value, enabled: false })}
        >
          <Minus size={14} />
        </IconButton>
      </ControlRow>
    </FormatWidget>
  )
}

export default AnimationWidget
