import AnimationWidget from './interaction/AnimationWidget'
import { isLegendRelevant } from '../charts/isLegendRelevant'
import LegendInteractionWidget from './interaction/LegendInteractionWidget'

import type { ChartInspectorProps } from './types'

function InteractionInspectorTab({
  actions,
  chart,
  fields,
}: ChartInspectorProps) {
  const { interaction } = chart.spec
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
