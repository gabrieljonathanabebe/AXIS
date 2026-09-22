import AnimationWidget from './interaction/AnimationWidget'
import { isLegendRelevant } from '../../chart/isLegendRelevant'
import LegendInteractionWidget from './interaction/LegendInteractionWidget'
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
  const showLegendInteraction = isLegendRelevant(chart)
  return (
    <div className="stack inspector-tab-content">
      {showLegendInteraction ? (
        <LegendInteractionWidget
          value={interaction.legend}
          onChange={(legend) => {
            onSetInteraction('legend', legend)
          }}
        />
      ) : null}
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
