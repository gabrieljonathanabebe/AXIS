import { Timer } from 'lucide-react'

import ScrubbableNumber from '@/shared/ui/controls/NumberControl'
import SelectControl from '@/shared/ui/controls/SelectControl'
import Group from '@/shared/ui/groups/Group'
import Row from '@/shared/ui/rows/Row'
import { DASHBOARD_ANIMATION } from './workspaceReducer'

import type { OptionItem } from '@/shared/ui/primitives/Menu'
import type { AnimationEasing, DashboardAnimation } from './types'

type AnimationGroupProps = {
  value: DashboardAnimation
  onChange: (value: DashboardAnimation) => void
}

/** Speed curves, named like CSS easings instead of the ECharts names. */
const easingOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Ease out', value: 'cubicOut' },
  { label: 'In-out', value: 'cubicInOut' },
] satisfies OptionItem<AnimationEasing>[]

/**
 * Animation group of the dashboard: without animation only the plus in its
 * heading, which adds the default animation, else one row with the speed
 * curve, the duration of all chart animations and a minus that removes it.
 */
function AnimationGroup({ value, onChange }: AnimationGroupProps) {
  if (!value.enabled) {
    return (
      <Group title="Animation" onAdd={() => onChange(DASHBOARD_ANIMATION)} />
    )
  }
  return (
    <Group title="Animation">
      <Row
        remove={{
          label: 'Remove animation',
          onRemove: () => onChange({ ...value, enabled: false }),
        }}
      >
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
      </Row>
    </Group>
  )
}

export default AnimationGroup
