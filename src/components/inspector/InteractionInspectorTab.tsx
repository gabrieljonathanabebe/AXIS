import AnimationWidget from './interaction/AnimationWidget'
import TooltipWidget from './interaction/TooltipWidget'
import ZoomWidget from './interaction/ZoomWidget'

import type { ChartInspectorProps } from './types'

type InteractionInspectorTabProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetInteraction'
>

function InteractionInspectorTab({
  chart,
  onSetInteraction,
}: InteractionInspectorTabProps) {
  const { interaction } = chart.spec

  return (
    <div className="stack inspector-tab-content">
      <TooltipWidget
        value={interaction.tooltip}
        onChange={(tooltip) => {
          onSetInteraction('tooltip', tooltip)
        }}
      />
      <ZoomWidget
        value={interaction.zoom}
        onChange={(zoom) => {
          onSetInteraction('zoom', zoom)
        }}
      />
      <AnimationWidget
        value={interaction.animation}
        onChange={(animation) => {
          onSetInteraction('animation', animation)
        }}
      />
    </div>
  )
}

export default InteractionInspectorTab
