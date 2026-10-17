import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import LegendWidget from './appearance/LegendWidget'
import ObjectFormatPopover from '../objects/ObjectFormatPopover'
import {
  getDefaultAxisTitle,
  getDefaultChartTitle,
} from '../charts/getChartTitle'
import { getFormatElements } from '../charts/getFormatElements'

import type { ReactNode } from 'react'
import type { ChartFormatElement } from '../charts/types'
import type { ChartInspectorProps } from './types'
import type { FormatTarget } from '../objects/types'

// ===== TYPES =================================================================
type ChartFormatPopoverProps = ChartInspectorProps & {
  element: ChartFormatElement
  target: FormatTarget
  onClose: () => void
  onElementChange: (element: ChartFormatElement) => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  legend: 'Legend',
  title: 'Title',
  xAxis: 'X Axis',
  xAxisLabels: 'X Axis Labels',
  yAxis: 'Y Axis',
  yAxisLabels: 'Y Axis Labels',
}

// ===== HELPERS ===============================================================
/**
 * Picks the widget of one chart element in its bare popover variant.
 * @param element Element selected in the popover.
 * @param inspectorProps Actions, chart and fields of the inspector.
 * @returns The widget, wired to the same actions as the inspector.
 */
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
    case 'xAxisLabels':
    case 'yAxis':
    case 'yAxisLabels': {
      const axis = element.startsWith('x') ? 'x' : 'y'
      const axisElement = `${axis}Axis` as const
      return (
        <AxisWidget
          defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
          orientation={axis}
          part={element === axisElement ? 'title' : 'labels'}
          value={appearance[axisElement]}
          variant="bare"
          onChange={(value) => actions.setAppearance(axisElement, value)}
        />
      )
    }
  }
}

// ===== FUNCTION ==============================================================
/**
 * Shows the format widget of one chart element next to the chart.
 * The element select switches between the elements of the same chart.
 */
function ChartFormatPopover({
  element,
  target,
  onClose,
  onElementChange,
  ...inspectorProps
}: ChartFormatPopoverProps) {
  const { chart, fields } = inspectorProps
  const elementOptions = getFormatElements(chart, fields).map((element) => ({
    label: elementTitles[element],
    value: element,
  }))
  return (
    <ObjectFormatPopover
      element={element}
      elementOptions={elementOptions}
      label="Chart format"
      target={target}
      onClose={onClose}
      onElementChange={onElementChange}
    >
      {renderFormatWidget(element, inspectorProps)}
    </ObjectFormatPopover>
  )
}

export default ChartFormatPopover
