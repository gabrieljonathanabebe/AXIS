import ChartInspector from './ChartInspector'
import Panel from './ui/Panel'
import type {
  Aggregation,
  ChartAppearance,
  ChartConfig,
  ChartEncoding,
  DataField,
} from '../types/chart'

type InspectorPanelProps = {
  chartConfig: ChartConfig
  fields: DataField[]
  onSetAggregation: (aggregation: Aggregation) => void
  onSetAppearance: <TKey extends keyof ChartAppearance>(
    key: TKey,
    value: ChartAppearance[TKey],
  ) => void
  onSetChartAppearance: <
    TChartKey extends 'scatter' | 'line' | 'bar',
    TOptionKey extends keyof ChartAppearance[TChartKey],
  >(
    chartKey: TChartKey,
    optionKey: TOptionKey,
    value: ChartAppearance[TChartKey][TOptionKey],
  ) => void
  onSetEncodingField: (axis: keyof ChartEncoding, fieldName: string) => void
}

function InspectorPanel({
  chartConfig,
  fields,
  onSetAggregation,
  onSetAppearance,
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
        <ChartInspector
          chartConfig={chartConfig}
          fields={fields}
          onSetAggregation={onSetAggregation}
          onSetAppearance={onSetAppearance}
          onSetChartAppearance={onSetChartAppearance}
          onSetEncodingField={onSetEncodingField}
        />
      </div>
    </Panel>
  )
}

export default InspectorPanel
