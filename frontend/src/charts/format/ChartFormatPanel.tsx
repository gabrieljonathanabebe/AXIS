import { Fragment } from 'react'

import {
  getDefaultAxisTitle,
  getDefaultChartTitle,
  getDefaultColorScaleTitle,
} from '@/charts/getChartTitle'
import {
  getEffectiveTimeGrain,
  isDateField,
} from '@/charts/getEffectiveTimeGrain'
import { getFormatElements } from '@/charts/getFormatElements'
import ContainerElement from '@/objects/ContainerElement'
import { getObjectDefinition } from '@/objects/objectDefinitions'
import TitleElement from '@/objects/TitleElement'
import FormatPanel from '@/shared/ui/containers/FormatPanel'
import { getVisibility } from '@/shared/ui/groups/getVisibility'
import StrokeGroup from '@/shared/ui/groups/StrokeGroup'
import AxisLabelsGroup from './AxisLabelsGroup'
import AxisTitleGroup from './AxisTitleGroup'
import ColorScaleElement from './ColorScaleElement'
import LegendElement from './LegendElement'
import LegendInteractionGroup from './LegendInteractionGroup'
import { getMarkGroups, MARK_GROUP_ORDER } from './markGroups'
import ZoomGroup from './ZoomGroup'

import type { ReactNode } from 'react'
import type { ChartFormatElement, ChartFormatProps } from '@/charts/types'
import type { FormatVisibility } from '@/shared/ui/groups/Group'

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
  colorScaleLabels: 'Color Scale Labels',
  colorScaleTitle: 'Color Scale Title',
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
        <ColorScaleElement
          defaultTitle={getDefaultColorScaleTitle(chart)}
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
        <ContainerElement
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
          <LegendElement
            value={appearance.legend}
            onChange={(value) => actions.setAppearance('legend', value)}
          />
          <LegendInteractionGroup
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
        <TitleElement
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
          <AxisTitleGroup
            defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
            label={elementTitles[element]}
            value={axisAppearance.title}
            onChange={(title) => setAxis({ ...axisAppearance, title })}
          />
          <AxisLabelsGroup
            dateAxis={
              axis === 'x'
                ? {
                    grain: getEffectiveTimeGrain(chart.spec.data, fields),
                    hasDateField: fields.some(
                      (field) =>
                        field.name === chart.spec.data.encoding.x &&
                        isDateField(field),
                    ),
                  }
                : undefined
            }
            group={`${axis}AxisLabels`}
            label={elementTitles[element]}
            value={axisAppearance.labels}
            onChange={(labels) => setAxis({ ...axisAppearance, labels })}
          />
          <StrokeGroup
            label="Axis line"
            maxWidth={4}
            title="Line"
            value={axisAppearance.line}
            onChange={(line) => setAxis({ ...axisAppearance, line })}
          />
          <StrokeGroup
            label="Grid"
            maxWidth={4}
            title="Gridlines"
            value={axisAppearance.gridLines}
            onChange={(gridLines) => setAxis({ ...axisAppearance, gridLines })}
          />
          {axis === 'x' ? (
            <ZoomGroup
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
      return getVisibility(colorScale.continuous, (continuous) =>
        actions.setAppearance('colorScale', { ...colorScale, continuous }),
      )
    case 'legend':
      return getVisibility(legend, (value) =>
        actions.setAppearance('legend', value),
      )
    case 'title':
      return getVisibility(title, (value) =>
        actions.setAppearance('title', value),
      )
    case 'xAxis':
    case 'yAxis':
      return getVisibility(chart.spec.appearance[element], (value) =>
        actions.setAppearance(element, value),
      )
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
