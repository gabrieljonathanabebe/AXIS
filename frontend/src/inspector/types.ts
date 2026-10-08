import type {
  ChartAggregationKey,
  ChartAppearanceSpec,
  ChartContainerAppearance,
  ChartDataSpec,
  ChartEncoding,
  ChartInstance,
  ChartInteractionSpec,
  ChartMarkKey,
  ChartType,
} from '../charts/types'
import type { DataField } from '../datasets/types'

import type { DashboardLayout, DashboardSpec } from '../workspace/types'

export type SetAggregation = <TKey extends ChartAggregationKey>(
  key: TKey,
  aggregation: ChartDataSpec[TKey],
) => void

export type SetAppearance = <TKey extends keyof ChartAppearanceSpec>(
  key: TKey,
  value: ChartAppearanceSpec[TKey],
) => void

export type SetInteraction = <TKey extends keyof ChartInteractionSpec>(
  key: TKey,
  value: ChartInteractionSpec[TKey],
) => void

export type SetChartAppearance = <
  TChartKey extends ChartMarkKey,
  TOptionKey extends keyof ChartAppearanceSpec[TChartKey],
>(
  chartKey: TChartKey,
  optionKey: TOptionKey,
  value: ChartAppearanceSpec[TChartKey][TOptionKey],
) => void

export type SetChartType = (type: ChartType) => void

export type SetContainer = <TKey extends keyof ChartContainerAppearance>(
  key: TKey,
  value: ChartContainerAppearance[TKey],
) => void

export type SetEncodingField = (
  axis: keyof ChartEncoding,
  fieldName: string,
) => void

export type SetDashboardLayout = <TKey extends keyof DashboardLayout>(
  key: TKey,
  value: DashboardLayout[TKey],
) => void

export type ChartInspectorProps = {
  chart: ChartInstance
  fields: DataField[]
  onSetAggregation: SetAggregation
  onSetAppearance: SetAppearance
  onSetChartType: SetChartType
  onSetContainer: SetContainer
  onSetInteraction: SetInteraction
  onSetChartAppearance: SetChartAppearance
  onSetEncodingField: SetEncodingField
}

export type DashboardInspectorProps = {
  dashboard: DashboardSpec
  onRenameDashboard: (name: string) => void
  onSetDashboardLayout: SetDashboardLayout
}
