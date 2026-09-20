import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import GridWidget from './appearance/GridWidget'
import LabelsWidget from './appearance/LabelsWidget'
import MarkSeriesWidget from './appearance/MarkSeriesWidget'

import type { ChartInspectorProps } from './types'

type AppearanceInspectorTabProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAppearance' | 'onSetChartAppearance'
>

function AppearanceInspectorTab({
  chart,
  onSetAppearance,
  onSetChartAppearance,
}: AppearanceInspectorTabProps) {
  const { appearance } = chart.spec

  return (
    <div className="stack inspector-tab-content">
      <ChartTitleWidget
        value={appearance.title}
        onChange={(title) => {
          onSetAppearance('title', title)
        }}
      />
      <LabelsWidget
        value={appearance.labels}
        onChange={(labels) => {
          onSetAppearance('labels', labels)
        }}
      />
      <MarkSeriesWidget
        chart={chart}
        onSetAppearance={onSetAppearance}
        onSetChartAppearance={onSetChartAppearance}
      />
      <GridWidget
        value={appearance.grid}
        onChange={(grid) => {
          onSetAppearance('grid', grid)
        }}
      />
      <AxisWidget
        orientation="x"
        value={appearance.xAxis}
        onChange={(xAxis) => {
          onSetAppearance('xAxis', xAxis)
        }}
      />
      <AxisWidget
        orientation="y"
        value={appearance.yAxis}
        onChange={(yAxis) => {
          onSetAppearance('yAxis', yAxis)
        }}
      />
    </div>
  )
}

export default AppearanceInspectorTab
