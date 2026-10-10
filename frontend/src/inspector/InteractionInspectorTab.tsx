import AnimationWidget from './interaction/AnimationWidget'
import { isLegendRelevant } from '../charts/isLegendRelevant'
import { isRadialChartType } from '../charts/isRadialChartType'
import LegendInteractionWidget from './interaction/LegendInteractionWidget'
import TooltipWidget from './interaction/TooltipWidget'
import ZoomWidget from './interaction/ZoomWidget'

import type { ChartInspectorProps } from './types'

function InteractionInspectorTab({
  actions,
  chart,
  fields,
}: ChartInspectorProps) {
  const { interaction } = chart.spec
  const isRadialChart = isRadialChartType(chart.type)
  const showLegendInteraction = isLegendRelevant(chart, fields)
  return (
    <div className="stack inspector-tab-content">
      {showLegendInteraction ? (
        <LegendInteractionWidget
          value={interaction.legend}
          onChange={(legend) => {
            actions.setInteraction('legend', legend)
          }}
        />
      ) : null}
      <TooltipWidget
        showTrigger={!isRadialChart}
        value={interaction.tooltip}
        onChange={(tooltip) => {
          actions.setInteraction('tooltip', tooltip)
        }}
      />
      {!isRadialChart ? (
        <ZoomWidget
          value={interaction.zoom}
          onChange={(zoom) => {
            actions.setInteraction('zoom', zoom)
          }}
        />
      ) : null}
      <AnimationWidget
        value={interaction.animation}
        onChange={(animation) => {
          actions.setInteraction('animation', animation)
        }}
      />
    </div>
  )
}

export default InteractionInspectorTab
