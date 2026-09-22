import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import ColorScaleWidget from './appearance/ColorScaleWidget'
import GridWidget from './appearance/GridWidget'
import { isLegendRelevant } from '../../chart/isLegendRelevant'
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
  // CONSTANTS
  const { appearance } = chart.spec
  const { encoding } = chart.spec.data
  const showLegend = isLegendRelevant(chart)
  const showColorScale = encoding.color?.semantic_type === 'numeric'
  // RETURN TSX COMPONENT
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
      {showColorScale ? (
        <ColorScaleWidget
          value={appearance.colorScale.continuous}
          onChange={(continuous) => {
            onSetAppearance('colorScale', {
              ...appearance.colorScale,
              continuous,
            })
          }}
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
