import { Fragment } from 'react'

import ContainerWidget from '../../objects/ContainerWidget'
import { getObjectDefinition } from '../../objects/objectDefinitions'
import ObjectTitleWidget from '../../objects/ObjectTitleWidget'
import FormatPanel from '../../shared/ui/FormatPanel'
import FormatWidget from '../../shared/ui/FormatWidget'
import { getDefaultAxisTitle, getDefaultChartTitle } from '../getChartTitle'
import { getFormatElements } from '../getFormatElements'
import AxisStrokeWidget from './AxisStrokeWidget'
import AxisWidget from './AxisWidget'
import ColorScaleWidget from './ColorScaleWidget'
import LegendInteractionWidget from './LegendInteractionWidget'
import LegendWidget from './LegendWidget'
import { getMarkGroups, MARK_GROUP_ORDER } from './markGroups'
import ZoomWidget from './ZoomWidget'

import type { ReactNode } from 'react'
import type { FormatVisibility } from '../../shared/ui/FormatWidget'
import type { ChartFormatElement, ChartFormatProps } from '../types'

// ===== TYPES =================================================================
type ChartFormatPanelProps = ChartFormatProps & {
  element: ChartFormatElement
  isCollapsed: boolean
  revealedGroup?: string | null
  onElementChange: (element: ChartFormatElement) => void
  onToggleCollapse: () => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  colorScale: 'Color Scale',
  container: 'Chart',
  labels: 'Data Labels',
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
 * Lists the format groups of one chart element, one below the other. Small
 * elements are groups of their parent, e.g. the data labels within the
 * marks.
 * @param element Element shown in the panel.
 * @param formatProps Actions, chart and fields of the chart.
 * @returns The groups of the element, each wired to its chart action.
 */
function getFormatGroups(
  element: ChartFormatElement,
  { actions, chart, fields, style }: ChartFormatProps,
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
          layout={chart.layout}
          minSize={getObjectDefinition(chart.kind).minSize}
          value={chart.container}
          onChange={actions.setContainer}
          onLayoutChange={actions.setLayout}
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
      const markGroups = getMarkGroups({ actions, chart, fields, style })
      return MARK_GROUP_ORDER.map((key) => (
        <Fragment key={key}>{markGroups[key]}</Fragment>
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
    case 'xAxis':
    case 'yAxis': {
      const axis = element === 'xAxis' ? 'x' : 'y'
      const axisElement = element
      const axisAppearance = appearance[axisElement]

      /** Saves the changed axis, e.g. its title or its labels. */
      function setAxis(value: typeof axisAppearance): void {
        actions.setAppearance(axisElement, value)
      }

      return (
        <>
          <AxisWidget
            defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
            orientation={axis}
            part="title"
            value={axisAppearance}
            onChange={setAxis}
          />
          <FormatWidget group={`${axis}AxisLabels`} title="Labels">
            <AxisWidget
              orientation={axis}
              part="labels"
              value={axisAppearance}
              onChange={setAxis}
            />
          </FormatWidget>
          <AxisStrokeWidget
            label="Axis line"
            title="Line"
            value={axisAppearance.line}
            onChange={(line) => setAxis({ ...axisAppearance, line })}
          />
          <AxisStrokeWidget
            label="Grid"
            title="Gridlines"
            value={axisAppearance.gridLines}
            onChange={(gridLines) => setAxis({ ...axisAppearance, gridLines })}
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
 * Eye that shows or hides a whole chart element; it sits in the popover
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
 * Shows the format groups of one chart element in the format panel.
 * The element select switches between the elements of the same chart.
 */
function ChartFormatPanel({
  element,
  isCollapsed,
  revealedGroup,
  onElementChange,
  onToggleCollapse,
  ...formatProps
}: ChartFormatPanelProps) {
  const { chart, fields } = formatProps
  const elementOptions = getFormatElements(chart, fields).map((element) => ({
    label: elementTitles[element],
    value: element,
  }))
  return (
    <FormatPanel
      elementSelect={{
        element,
        options: elementOptions,
        onChange: onElementChange,
      }}
      isCollapsed={isCollapsed}
      label="Chart format"
      revealedGroup={revealedGroup}
      visibility={getElementVisibility(element, formatProps)}
      onToggleCollapse={onToggleCollapse}
    >
      {getFormatGroups(element, formatProps)}
    </FormatPanel>
  )
}

export default ChartFormatPanel
