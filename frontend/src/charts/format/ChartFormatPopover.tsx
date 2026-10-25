import { Fragment } from 'react'

import ContainerWidget from '../../objects/ContainerWidget'
import ObjectFormatPopover from '../../objects/ObjectFormatPopover'
import ObjectTitleWidget from '../../objects/ObjectTitleWidget'
import { isRadialChartType } from '../chartDefinitions'
import { CHART_AXIS_LINE, CHART_GRID_LINES } from '../createChartInstance'
import { getDefaultAxisTitle, getDefaultChartTitle } from '../getChartTitle'
import { getFormatElements } from '../getFormatElements'
import AxisStrokeWidget from './AxisStrokeWidget'
import AxisWidget from './AxisWidget'
import ColorScaleWidget from './ColorScaleWidget'
import LegendInteractionWidget from './LegendInteractionWidget'
import LegendWidget from './LegendWidget'
import { getMarkGroups, MARK_GROUP_ORDER } from './markGroups'
import TooltipWidget from './TooltipWidget'
import ZoomWidget from './ZoomWidget'

import type { ReactNode } from 'react'
import type { FormatTarget } from '../../objects/types'
import type { FormatVisibility } from '../../shared/ui/FormatWidget'
import type { ChartFormatElement, ChartFormatProps } from '../types'

// ===== TYPES =================================================================
type ChartFormatPopoverProps = ChartFormatProps & {
  element: ChartFormatElement
  target: FormatTarget
  onClose: () => void
  onElementChange: (element: ChartFormatElement) => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  colorScale: 'Color Scale',
  container: 'Chart',
  legend: 'Legend',
  marks: 'Marks',
  title: 'Title',
  tooltip: 'Tooltip',
  xAxis: 'X Axis',
  xAxisLabels: 'X Axis Labels',
  yAxis: 'Y Axis',
  yAxisLabels: 'Y Axis Labels',
}

// ===== HELPERS ===============================================================
/**
 * Lists the format groups of one chart element, one below the other.
 * @param element Element selected in the popover.
 * @param formatProps Actions, chart and fields of the chart.
 * @param onElementChange Switches the popover to another element, e.g. from
 *   the marks to their tooltip.
 * @returns The groups of the element, each wired to its chart action.
 */
function getFormatGroups(
  element: ChartFormatElement,
  { actions, chart, fields }: ChartFormatProps,
  onElementChange: (element: ChartFormatElement) => void,
): ReactNode {
  const { appearance, interaction } = chart.spec
  switch (element) {
    case 'colorScale':
      return (
        <ColorScaleWidget
          value={appearance.colorScale.continuous}
          onChange={(continuous) =>
            actions.setAppearance('colorScale', {
              ...appearance.colorScale,
              continuous,
            })
          }
        />
      )
    case 'container':
      return (
        <ContainerWidget
          value={chart.container}
          onChange={actions.setContainer}
        />
      )
    case 'legend':
      return (
        <>
          <LegendWidget
            value={appearance.legend}
            onChange={(value) => actions.setAppearance('legend', value)}
          />
          <LegendInteractionWidget
            value={interaction.legend}
            onChange={(value) => actions.setInteraction('legend', value)}
          />
        </>
      )
    case 'marks': {
      const groups = getMarkGroups({ actions, chart, fields }, onElementChange)
      return MARK_GROUP_ORDER.map((key) => (
        <Fragment key={key}>{groups[key]}</Fragment>
      ))
    }
    case 'title':
      return (
        <ObjectTitleWidget
          defaultTitle={getDefaultChartTitle(chart, fields)}
          value={appearance.title}
          onChange={(value) => actions.setAppearance('title', value)}
        />
      )
    case 'tooltip':
      return (
        <TooltipWidget
          showTrigger={!isRadialChartType(chart.type)}
          value={interaction.tooltip}
          onChange={(value) => actions.setInteraction('tooltip', value)}
        />
      )
    case 'xAxis':
    case 'xAxisLabels':
    case 'yAxis':
    case 'yAxisLabels': {
      const axis = element.startsWith('x') ? 'x' : 'y'
      const axisElement = `${axis}Axis` as const
      const axisAppearance = appearance[axisElement]
      const isAxisTitle = element === axisElement
      const axisWidget = (
        <AxisWidget
          defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
          orientation={axis}
          part={isAxisTitle ? 'title' : 'labels'}
          value={axisAppearance}
          onChange={(value) => actions.setAppearance(axisElement, value)}
        />
      )
      if (!isAxisTitle) {
        return axisWidget
      }
      return (
        <>
          {axisWidget}
          <AxisStrokeWidget
            defaultColor={CHART_AXIS_LINE.stroke.color}
            label="Axis line"
            title="Line"
            value={axisAppearance.line}
            onChange={(line) =>
              actions.setAppearance(axisElement, { ...axisAppearance, line })
            }
          />
          <AxisStrokeWidget
            defaultColor={CHART_GRID_LINES.stroke.color}
            label="Grid"
            title="Gridlines"
            value={axisAppearance.gridLines}
            onChange={(gridLines) =>
              actions.setAppearance(axisElement, {
                ...axisAppearance,
                gridLines,
              })
            }
          />
          {axis === 'x' ? (
            <ZoomWidget
              value={interaction.zoom}
              onChange={(value) => actions.setInteraction('zoom', value)}
            />
          ) : null}
        </>
      )
    }
  }
}

/**
 * Toggle that shows or hides a whole chart element; it sits in the popover
 * header.
 * @param element Element selected in the popover.
 * @param formatProps Actions and chart of the chart.
 * @returns The visibility, or none for elements that always show.
 */
function getElementVisibility(
  element: ChartFormatElement,
  { actions, chart }: ChartFormatProps,
): FormatVisibility | undefined {
  const { colorScale, legend, title } = chart.spec.appearance
  const { tooltip } = chart.spec.interaction
  switch (element) {
    case 'colorScale':
      return {
        visible: colorScale.continuous.visible,
        onChange: (visible) =>
          actions.setAppearance('colorScale', {
            ...colorScale,
            continuous: { ...colorScale.continuous, visible },
          }),
      }
    case 'legend':
      return {
        visible: legend.visible,
        onChange: (visible) =>
          actions.setAppearance('legend', { ...legend, visible }),
      }
    case 'title':
      return {
        visible: title.visible,
        onChange: (visible) =>
          actions.setAppearance('title', { ...title, visible }),
      }
    case 'tooltip':
      return {
        label: 'Enabled',
        visible: tooltip.enabled,
        onChange: (enabled) =>
          actions.setInteraction('tooltip', { ...tooltip, enabled }),
      }
    case 'xAxis':
    case 'yAxis': {
      const axis = chart.spec.appearance[element]
      return {
        visible: axis.visible,
        onChange: (visible) =>
          actions.setAppearance(element, { ...axis, visible }),
      }
    }
    default:
      return undefined
  }
}

// ===== FUNCTION ==============================================================
/**
 * Shows the format groups of one chart element next to the chart.
 * The element select switches between the elements of the same chart.
 */
function ChartFormatPopover({
  element,
  target,
  onClose,
  onElementChange,
  ...formatProps
}: ChartFormatPopoverProps) {
  const { chart, fields } = formatProps
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
      visibility={getElementVisibility(element, formatProps)}
      onClose={onClose}
      onElementChange={onElementChange}
    >
      {getFormatGroups(element, formatProps, onElementChange)}
    </ObjectFormatPopover>
  )
}

export default ChartFormatPopover
