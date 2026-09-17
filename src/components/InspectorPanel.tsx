import ChartInspector from './ChartInspector'
import Panel from './ui/Panel'
import type {
  Aggregation,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartInstance,
  ChartInteractionSpec,
  DataField,
} from '../types/chart'

type InspectorPanelProps = {
  chart: ChartInstance | null
  fields: DataField[]
  onSetAggregation: (aggregation: Aggregation) => void
  onSetAppearance: <TKey extends keyof ChartAppearanceSpec>(
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ) => void
  onSetInteraction: <TKey extends keyof ChartInteractionSpec>(
    key: TKey,
    value: ChartInteractionSpec[TKey],
  ) => void
  onSetChartAppearance: <
    TChartKey extends 'scatter' | 'line' | 'bar',
    TOptionKey extends keyof ChartAppearanceSpec[TChartKey],
  >(
    chartKey: TChartKey,
    optionKey: TOptionKey,
    value: ChartAppearanceSpec[TChartKey][TOptionKey],
  ) => void
  onSetEncodingField: (axis: keyof ChartEncoding, fieldName: string) => void
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
      className="inspector-panel side-panel"
    >
      <div className="side-panel-scroll">
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
      </div>
    </Panel>
  )
}

export default InspectorPanel
