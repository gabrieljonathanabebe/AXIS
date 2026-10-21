import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import ContainerWidget from './appearance/ContainerWidget'
import {
  getDefaultAxisTitle,
  getDefaultChartTitle,
} from '../charts/getChartTitle'
import { isLegendRelevant } from '../charts/isLegendRelevant'
import { isRadialChartType } from '../charts/chartDefinitions'
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
  const showLegend = isLegendRelevant(chart, fields)

  // ===== RETURN ==============================================================
  return (
    <div className="stack inspector-tab-content">
      <ContainerWidget
        value={chart.container}
        onChange={actions.setContainer}
      />
      <ChartTitleWidget
        defaultTitle={getDefaultChartTitle(chart, fields)}
        value={appearance.title}
        onChange={(title) => {
          actions.setAppearance('title', title)
        }}
      />
      <MarkSeriesWidget chart={chart} fields={fields} actions={actions} />
      {showLegend ? (
        <LegendWidget
          value={appearance.legend}
          onChange={(legend) => actions.setAppearance('legend', legend)}
        />
      ) : null}
      {!isRadialChart ? (
        <>
          <AxisWidget
            defaultTitle={getDefaultAxisTitle(chart, fields, 'x')}
            orientation="x"
            value={appearance.xAxis}
            onChange={(xAxis) => {
              actions.setAppearance('xAxis', xAxis)
            }}
          />
          <AxisWidget
            defaultTitle={getDefaultAxisTitle(chart, fields, 'y')}
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
