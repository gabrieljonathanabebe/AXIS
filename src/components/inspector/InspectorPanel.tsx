import ChartInspector from './ChartInspector'
import Panel from '../ui/Panel'
import type { ChartInstance } from '../../types/chart'
import type { ChartInspectorProps } from './types'

type InspectorPanelProps = Omit<ChartInspectorProps, 'chart'> & {
  chart: ChartInstance | null
}

function InspectorPanel({
  chart,
  fields,
  onSetAggregation,
  onSetAppearance,
  onSetInteraction,
  onSetChartAppearance,
  onSetEncodingField,
}: InspectorPanelProps) {
  return (
    <Panel
      as="aside"
      eyebrow="Inspect"
      title="Inspector"
      className="inspector-panel"
      isScrollable
    >
      {chart ? (
        <ChartInspector
          chart={chart}
          fields={fields}
          onSetAggregation={onSetAggregation}
          onSetAppearance={onSetAppearance}
          onSetInteraction={onSetInteraction}
          onSetChartAppearance={onSetChartAppearance}
          onSetEncodingField={onSetEncodingField}
        />
      ) : (
        <span className="inspector-empty">Select a chart to inspect it.</span>
      )}
    </Panel>
  )
}

export default InspectorPanel
