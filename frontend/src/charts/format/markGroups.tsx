import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChartLine,
  ChartSpline,
  Circle,
  CircleDot,
  CircleDotDashed,
  Diamond,
  Donut,
  Scaling,
  Square,
  SquareRoundCorner,
  Triangle,
  UnfoldHorizontal,
} from 'lucide-react'

import { createEffect } from '../../shared/effect'
import ColorField from '../../shared/ui/ColorField'
import { DATA_COLOR_PRESETS } from '../../shared/ui/colorPresets'
import ControlRow from '../../shared/ui/ControlRow'
import DetailsPopover from '../../shared/ui/DetailsPopover'
import EffectControls from '../../shared/ui/EffectControls'
import FillControls from '../../shared/ui/FillControls'
import FormatWidget from '../../shared/ui/FormatWidget'
import GradientControl from '../../shared/ui/GradientControl'
import PaletteControl from '../../shared/ui/PaletteControl'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import StrokeStyleControls from '../../shared/ui/StrokeStyleControls'
import { categoricalColorPalettes } from '../colorPalettes'
import { CHART_MARK_BORDER } from '../createChartInstance'
import { getColorEncodingMode } from '../getColorEncodingMode'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Effect } from '../../shared/effect'
import type { FormatVisibility } from '../../shared/ui/FormatWidget'
import type { OptionItem } from '../../shared/ui/OptionsMenu'
import type {
  ChartFormatElement,
  ChartFormatProps,
  ColorScaleAppearance,
  LinePoints,
  ScatterSymbol,
} from '../types'

// ===== TYPES =================================================================
/** One place of the marks element, e.g. its fill. */
export type MarkGroupKey = (typeof MARK_GROUP_ORDER)[number]

/** Groups a chart type fills; places it does not have stay empty. */
type MarkGroups = Partial<Record<MarkGroupKey, ReactNode>>

/** Marks that are filled shapes with a border: points, bars, segments. */
type FilledMarkKey = 'bar' | 'pie' | 'scatter'

type MarkGroupProps = Pick<ChartFormatProps, 'actions' | 'chart'>

/** Switches the popover to another element, e.g. the tooltip. */
type ElementChange = (element: ChartFormatElement) => void

/**
 * Data color of the marks: its field, and for a continuous scale its range
 * behind a gear.
 */
type DataColorControls = { details?: ReactNode; field: ReactNode }

/** Course of a line between its points: straight or a smooth curve. */
type LineCurve = 'smooth' | 'straight'

// ===== CONSTANTS =============================================================
/**
 * Fixed order of the groups of the marks element, the same for every
 * chart type: Data color → Shape → Fill → Stroke → Effect → Points →
 * Labels → Tooltip. The data color is the group drawn with it, e.g. Fill
 * for bars or Line for lines.
 */
export const MARK_GROUP_ORDER = [
  'dataColor',
  'shape',
  'fill',
  'stroke',
  'effect',
  'points',
  'labels',
  'tooltip',
] as const

const lineCurveOptions = [
  { icon: ChartLine, label: 'Straight', value: 'straight' },
  { icon: ChartSpline, label: 'Smooth', value: 'smooth' },
] satisfies OptionItem<LineCurve>[]

const linePointsOptions = [
  { icon: CircleDotDashed, label: 'Auto', value: 'auto' },
  { icon: CircleDot, label: 'Always', value: 'on' },
] satisfies OptionItem<LinePoints>[]

const scatterSymbolOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'rect' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' },
] satisfies { label: string; value: ScatterSymbol }[]

const scatterSymbolIcons = {
  circle: Circle,
  diamond: Diamond,
  rect: Square,
  triangle: Triangle,
} satisfies Record<ScatterSymbol, LucideIcon>

// ===== HELPERS ===============================================================
/**
 * Group without rows whose paintbrush opens another element, e.g. the
 * tooltip; with a visibility, its eye also shows or hides that element.
 * @param title Title of the group.
 * @param element Element the paintbrush opens.
 * @param onElementChange Switches the popover to that element.
 * @param visibility Shows or hides the element, e.g. the data labels.
 * @returns The group with a paintbrush and an optional eye in its heading.
 */
function getElementLinkGroup(
  title: string,
  element: ChartFormatElement,
  onElementChange: ElementChange,
  visibility?: FormatVisibility,
): ReactNode {
  return (
    <FormatWidget
      title={title}
      visibility={visibility}
      onFormat={() => onElementChange(element)}
    />
  )
}

/**
 * Data color in the color row of the marks: one color, a palette for
 * categories, or a gradient when a continuous field colors the marks; the
 * gradient brings the range of its scale behind a gear.
 * @param formatProps Actions, chart and fields of the chart.
 * @returns The field of the color mode and, for a gradient, its details.
 */
function getDataColorControls({
  actions,
  chart,
  fields,
}: ChartFormatProps): DataColorControls {
  const { appearance } = chart.spec
  const colorEncodingMode = getColorEncodingMode(
    chart.type,
    chart.spec.data.encoding,
    fields,
  )
  if (colorEncodingMode === 'constant') {
    return {
      field: (
        <ColorField
          label="Chart"
          presets={DATA_COLOR_PRESETS}
          value={appearance.color}
          onChange={(color) => actions.setAppearance('color', color)}
        />
      ),
    }
  }
  if (colorEncodingMode === 'categorical') {
    return {
      field: (
        <PaletteControl
          label="Categorical color palette"
          palettes={categoricalColorPalettes}
          value={appearance.colorScale.categorical.palette}
          onChange={(palette) => {
            actions.setAppearance('colorScale', {
              ...appearance.colorScale,
              categorical: { ...appearance.colorScale.categorical, palette },
            })
          }}
        />
      ),
    }
  }
  const { continuous } = appearance.colorScale

  /** Saves changed fields of the continuous scale, e.g. its minimum. */
  function setContinuous(
    changes: Partial<ColorScaleAppearance['continuous']>,
  ): void {
    actions.setAppearance('colorScale', {
      ...appearance.colorScale,
      continuous: { ...continuous, ...changes },
    })
  }

  return {
    details: (
      <DetailsPopover label="Color range">
        <ControlRow>
          <ScrubbableNumber
            icon={<ArrowDownToLine size={14} />}
            label="Color scale minimum"
            step={1}
            value={continuous.min}
            onAuto={() => setContinuous({ min: null })}
            onValueChange={(min) => setContinuous({ min })}
          />
          <ScrubbableNumber
            icon={<ArrowUpToLine size={14} />}
            label="Color scale maximum"
            step={1}
            value={continuous.max}
            onAuto={() => setContinuous({ max: null })}
            onValueChange={(max) => setContinuous({ max })}
          />
        </ControlRow>
      </DetailsPopover>
    ),
    field: (
      <GradientControl
        label="Chart"
        startColor={continuous.startColor}
        endColor={continuous.endColor}
        onChange={setContinuous}
      />
    ),
  }
}

/**
 * Effect group of one mark: without an effect only the plus in its
 * heading, which adds a glow, else the row of the effect.
 * @param label Name of the mark for screen readers, e.g. "Bar".
 * @param effect Effect of the mark.
 * @param onChange Saves the changed effect.
 * @returns The effect group.
 */
function getEffectGroup(
  label: string,
  effect: Effect,
  onChange: (effect: Effect) => void,
): ReactNode {
  if (effect.kind === 'none') {
    return (
      <FormatWidget
        title="Effect"
        onAdd={() => onChange(createEffect('glow'))}
      />
    )
  }
  return (
    <FormatWidget title="Effect">
      <EffectControls label={label} value={effect} onChange={onChange} />
    </FormatWidget>
  )
}

/**
 * Fill, border and effect of a filled mark; points, bars and pie segments
 * share them. The fill is drawn with the data color, so it takes the
 * place of the data color and shows its field.
 * @param props Actions and chart of the chart.
 * @param mark Appearance key of the mark.
 * @param label Name of the mark for screen readers, e.g. "Bar".
 * @param dataColor Field and details of the data color.
 * @returns The data color, stroke and effect groups.
 */
function getFilledMarkGroups(
  { actions, chart }: MarkGroupProps,
  mark: FilledMarkKey,
  label: string,
  dataColor: DataColorControls,
): MarkGroups {
  const { border, effect, fill } = chart.spec.appearance[mark]
  return {
    dataColor: (
      <FormatWidget title="Fill">
        <FillControls
          details={dataColor.details}
          label={`${label} fill`}
          seriesColor={dataColor.field}
          value={fill}
          onChange={(value) => actions.setChartAppearance(mark, 'fill', value)}
        />
      </FormatWidget>
    ),
    effect: getEffectGroup(label, effect, (value) => {
      actions.setChartAppearance(mark, 'effect', value)
    }),
    stroke: (
      <FormatWidget title="Border">
        <StrokeStyleControls
          defaultColor={CHART_MARK_BORDER.color}
          label={`${label} border`}
          value={border}
          onChange={(value) =>
            actions.setChartAppearance(mark, 'border', value)
          }
        />
      </FormatWidget>
    ),
  }
}

/**
 * Groups only some chart types have: shape, and for lines their area,
 * line, effect and points.
 * @param props Actions and chart of the chart.
 * @param dataColor Field and details of the data color for its group.
 * @returns The groups of the chart type.
 */
function getChartTypeGroups(
  props: MarkGroupProps,
  dataColor: DataColorControls,
): MarkGroups {
  const { actions, chart } = props
  const { bar, line, pie, scatter } = chart.spec.appearance
  const sizeField = chart.spec.data.encoding.size
  switch (chart.type) {
    case 'bar':
      return {
        ...getFilledMarkGroups(props, 'bar', 'Bar', dataColor),
        shape: (
          <FormatWidget title="Shape">
            <ControlRow>
              <ScrubbableNumber
                icon={<UnfoldHorizontal size={14} />}
                label="Bar width"
                max={64}
                min={8}
                step={2}
                unit="px"
                value={bar.barWidth}
                onValueChange={(barWidth) => {
                  actions.setChartAppearance('bar', 'barWidth', barWidth)
                }}
              />
              <ScrubbableNumber
                icon={<SquareRoundCorner size={14} />}
                label="Corner radius"
                max={24}
                min={0}
                step={1}
                unit="px"
                value={bar.borderRadius}
                onValueChange={(borderRadius) => {
                  actions.setChartAppearance(
                    'bar',
                    'borderRadius',
                    borderRadius,
                  )
                }}
              />
            </ControlRow>
          </FormatWidget>
        ),
      }
    case 'donut':
    case 'pie':
      return {
        ...getFilledMarkGroups(props, 'pie', 'Segment', dataColor),
        shape:
          chart.type === 'donut' ? (
            <FormatWidget title="Shape">
              <ControlRow>
                <ScrubbableNumber
                  icon={<Donut size={14} />}
                  label="Donut inner radius"
                  max={60}
                  min={20}
                  step={2}
                  unit="%"
                  value={pie.innerRadius}
                  onValueChange={(innerRadius) => {
                    actions.setChartAppearance(
                      'pie',
                      'innerRadius',
                      innerRadius,
                    )
                  }}
                />
              </ControlRow>
            </FormatWidget>
          ) : null,
      }
    case 'line':
      return {
        dataColor: (
          <FormatWidget title="Line">
            <StrokeStyleControls
              details={dataColor.details}
              label="Line"
              minWidth={1}
              seriesColor={dataColor.field}
              value={line.stroke}
              onChange={(stroke) => {
                actions.setChartAppearance('line', 'stroke', stroke)
              }}
            />
          </FormatWidget>
        ),
        effect: getEffectGroup('Line', line.effect, (effect) => {
          actions.setChartAppearance('line', 'effect', effect)
        }),
        fill: (
          <FormatWidget
            title="Area"
            visibility={{
              visible: line.areaFill,
              onChange: (areaFill) => {
                actions.setChartAppearance('line', 'areaFill', areaFill)
              },
            }}
          >
            <FillControls
              label="Area fill"
              value={line.area}
              onChange={(area) => {
                actions.setChartAppearance('line', 'area', area)
              }}
            />
          </FormatWidget>
        ),
        points: (
          <FormatWidget
            title="Points"
            visibility={{
              visible: line.points !== 'off',
              onChange: (visible) => {
                actions.setChartAppearance(
                  'line',
                  'points',
                  visible ? 'auto' : 'off',
                )
              },
            }}
          >
            <ControlRow>
              <SegmentedControl
                label="Line points"
                options={linePointsOptions}
                value={line.points}
                onValueChange={(points) => {
                  actions.setChartAppearance('line', 'points', points)
                }}
              />
            </ControlRow>
          </FormatWidget>
        ),
        shape: (
          <FormatWidget title="Shape">
            <ControlRow>
              <SegmentedControl
                label="Line curve"
                options={lineCurveOptions}
                value={line.smooth ? 'smooth' : 'straight'}
                onValueChange={(curve) => {
                  actions.setChartAppearance(
                    'line',
                    'smooth',
                    curve === 'smooth',
                  )
                }}
              />
            </ControlRow>
          </FormatWidget>
        ),
      }
    case 'scatter':
      return {
        ...getFilledMarkGroups(props, 'scatter', 'Point', dataColor),
        shape: (
          <FormatWidget title="Shape">
            <ControlRow>
              <SegmentedControl
                label="Scatter symbol"
                options={scatterSymbolOptions}
                value={scatter.symbol}
                renderOption={(option) => {
                  const SymbolIcon = scatterSymbolIcons[option.value]
                  return <SymbolIcon aria-hidden="true" size={13} />
                }}
                onValueChange={(symbol) => {
                  actions.setChartAppearance('scatter', 'symbol', symbol)
                }}
              />
              {sizeField ? null : (
                <ScrubbableNumber
                  icon={<Scaling size={14} />}
                  label="Point size"
                  max={28}
                  min={4}
                  step={1}
                  unit="px"
                  value={scatter.pointSize}
                  onValueChange={(pointSize) => {
                    actions.setChartAppearance(
                      'scatter',
                      'pointSize',
                      pointSize,
                    )
                  }}
                />
              )}
            </ControlRow>
            {sizeField ? (
              <ControlRow>
                <ScrubbableNumber
                  icon={<ArrowDownToLine size={14} />}
                  label="Smallest point size"
                  max={scatter.sizeRange.max}
                  min={2}
                  step={1}
                  unit="px"
                  value={scatter.sizeRange.min}
                  onValueChange={(min) => {
                    actions.setChartAppearance('scatter', 'sizeRange', {
                      ...scatter.sizeRange,
                      min,
                    })
                  }}
                />
                <ScrubbableNumber
                  icon={<ArrowUpToLine size={14} />}
                  label="Largest point size"
                  max={60}
                  min={scatter.sizeRange.min}
                  step={1}
                  unit="px"
                  value={scatter.sizeRange.max}
                  onValueChange={(max) => {
                    actions.setChartAppearance('scatter', 'sizeRange', {
                      ...scatter.sizeRange,
                      max,
                    })
                  }}
                />
              </ControlRow>
            ) : null}
          </FormatWidget>
        ),
      }
  }
}

// ===== FUNCTION ==============================================================
/**
 * Fills the places of the marks element for the chart type, e.g. Shape
 * with width and radius for bars. Places a chart type does not have stay
 * empty and drop out of the popover; `MARK_GROUP_ORDER` sets the order.
 * @param formatProps Actions, chart and fields of the chart.
 * @param onElementChange Switches the popover to its labels or tooltip.
 * @returns The groups by place.
 */
export function getMarkGroups(
  formatProps: ChartFormatProps,
  onElementChange: ElementChange,
): MarkGroups {
  const { actions, chart } = formatProps
  const { labels } = chart.spec.appearance
  const dataColor = getDataColorControls(formatProps)
  return {
    ...getChartTypeGroups(formatProps, dataColor),
    labels: getElementLinkGroup('Labels', 'labels', onElementChange, {
      visible: labels.visible,
      onChange: (visible) => {
        actions.setAppearance('labels', { ...labels, visible })
      },
    }),
    tooltip: getElementLinkGroup('Tooltip', 'tooltip', onElementChange),
  }
}
