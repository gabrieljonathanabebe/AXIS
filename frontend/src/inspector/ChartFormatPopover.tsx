import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import LegendWidget from './appearance/LegendWidget'
import Popover from '../shared/ui/Popover'
import {
  getDefaultAxisTitle,
  getDefaultChartTitle,
} from '../charts/getChartTitle'

import type { ReactNode } from 'react'
import type { ChartFormatElement } from '../charts/types'
import type { ChartFormatTarget, ChartInspectorProps } from './types'

// ===== TYPES =================================================================
type ChartFormatPopoverProps = ChartInspectorProps & {
  target: ChartFormatTarget
  onClose: () => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  legend: 'Legend',
  title: 'Title',
  xAxis: 'X Axis',
  yAxis: 'Y Axis',
}

// ===== HELPERS ===============================================================
function renderFormatWidget(
  element: ChartFormatElement,
  { actions, chart, fields }: ChartInspectorProps,
): ReactNode {
  const { appearance } = chart.spec
  switch (element) {
    case 'legend':
      return (
        <LegendWidget
          value={appearance.legend}
          variant="bare"
          onChange={(value) => actions.setAppearance('legend', value)}
        />
      )
    case 'title':
      return (
        <ChartTitleWidget
          defaultTitle={getDefaultChartTitle(chart, fields)}
          value={appearance.title}
          variant="bare"
          onChange={(value) => actions.setAppearance('title', value)}
        />
      )
    case 'xAxis':
    case 'yAxis': {
      const axis = element === 'xAxis' ? 'x' : 'y'
      return (
        <AxisWidget
          defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
          orientation={axis}
          value={appearance[element]}
          variant="bare"
          onChange={(value) => actions.setAppearance(element, value)}
        />
      )
    }
  }
}

// ===== FUNCTION ==============================================================
/** Shows the inspector widget of one chart element next to the chart. */
function ChartFormatPopover({
  target,
  onClose,
  ...inspectorProps
}: ChartFormatPopoverProps) {
  const title = elementTitles[target.element]
  return (
    <Popover
      anchor={target.anchor}
      className="chart-format-popover glass glass-thick"
      label={`${title} format`}
      open
      placement="right-start"
      title={title}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      {renderFormatWidget(target.element, inspectorProps)}
    </Popover>
  )
}

export default ChartFormatPopover
