import type {
  Aggregation,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartInstance,
  ChartInteractionSpec,
  DataField,
} from '../../types/chart'

export type SetAggregation = (aggregation: Aggregation) => void

export type SetAppearance = <TKey extends keyof ChartAppearanceSpec>(
  key: TKey,
  value: ChartAppearanceSpec[TKey],
) => void

export type SetInteraction = <TKey extends keyof ChartInteractionSpec>(
  key: TKey,
  value: ChartInteractionSpec[TKey],
) => void

export type SetChartAppearance = <
  TChartKey extends 'scatter' | 'line' | 'bar',
  TOptionKey extends keyof ChartAppearanceSpec[TChartKey],
>(
  chartKey: TChartKey,
  optionKey: TOptionKey,
  value: ChartAppearanceSpec[TChartKey][TOptionKey],
) => void

export type SetEncodingField = (
  axis: keyof ChartEncoding,
  fieldName: string,
) => void

export type ChartInspectorProps = {
  chart: ChartInstance
  fields: DataField[]
  onSetAggregation: SetAggregation
  onSetAppearance: SetAppearance
  onSetInteraction: SetInteraction
  onSetChartAppearance: SetChartAppearance
  onSetEncodingField: SetEncodingField
}
