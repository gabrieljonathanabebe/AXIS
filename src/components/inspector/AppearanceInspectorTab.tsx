import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import GridWidget from './appearance/GridWidget'
import LabelsWidget from './appearance/LabelsWidget'
import LegendWidget from './appearance/LegendWidget'
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
  const { encoding } = chart.spec.data
  const showLegend =
    ((chart.type === 'line' || chart.type == 'bar') &&
      Boolean(encoding.series)) ||
    (chart.type === 'scatter' &&
      encoding.color?.semantic_type === 'categorical')

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
      {showLegend ? (
        <LegendWidget
          value={appearance.legend}
          onChange={(legend) => onSetAppearance('legend', legend)}
        />
      ) : null}
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
