import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import ColorScaleWidget from './appearance/ColorScaleWidget'
import ContainerWidget from './appearance/ContainerWidget'
import { getColorEncodingMode } from '../charts/getColorEncodingMode'
import GridWidget from './appearance/GridWidget'
import { isLegendRelevant } from '../charts/isLegendRelevant'
import { isRadialChartType } from '../charts/chartDefinitions'
import LabelsWidget from './appearance/LabelsWidget'
import LegendWidget from './appearance/LegendWidget'
import MarkSeriesWidget from './appearance/MarkSeriesWidget'

import type { ChartInspectorProps } from './types'

function AppearanceInspectorTab({
  actions,
  chart,
  fields,
}: ChartInspectorProps) {
  // ===== CONSTANTS ===========================================================
  const { appearance } = chart.spec
  const isRadialChart = isRadialChartType(chart.type)
  const showColorScale =
    getColorEncodingMode(chart.type, chart.spec.data.encoding, fields) ===
    'continuous'
  const showLegend = isLegendRelevant(chart, fields)

  // ===== RETURN ==============================================================
  return (
    <div className="stack inspector-tab-content">
      <ContainerWidget
        value={chart.container}
        onChange={actions.setContainer}
      />
      <ChartTitleWidget
        value={appearance.title}
        onChange={(title) => {
          actions.setAppearance('title', title)
        }}
      />
      <LabelsWidget
        isRadial={isRadialChart}
        value={appearance.labels}
        onChange={(labels) => {
          actions.setAppearance('labels', labels)
        }}
      />
      <MarkSeriesWidget chart={chart} fields={fields} actions={actions} />
      {showLegend ? (
        <LegendWidget
          value={appearance.legend}
          onChange={(legend) => actions.setAppearance('legend', legend)}
        />
      ) : null}
      {showColorScale ? (
        <ColorScaleWidget
          value={appearance.colorScale.continuous}
          onChange={(continuous) => {
            actions.setAppearance('colorScale', {
              ...appearance.colorScale,
              continuous,
            })
          }}
        />
      ) : null}
      {!isRadialChart ? (
        <>
          <GridWidget
            value={appearance.grid}
            onChange={(grid) => {
              actions.setAppearance('grid', grid)
            }}
          />
          <AxisWidget
            orientation="x"
            value={appearance.xAxis}
            onChange={(xAxis) => {
              actions.setAppearance('xAxis', xAxis)
            }}
          />
          <AxisWidget
            orientation="y"
            value={appearance.yAxis}
            onChange={(yAxis) => {
              actions.setAppearance('yAxis', yAxis)
            }}
          />
        </>
      ) : null}
    </div>
  )
}

export default AppearanceInspectorTab
