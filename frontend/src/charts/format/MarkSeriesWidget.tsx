import { Circle, Diamond, Square, Triangle } from 'lucide-react'

import { categoricalColorPalettes } from '../colorPalettes'
import ColorControl from '../../shared/ui/ColorControl'
import ControlRow from '../../shared/ui/ControlRow'
import { getColorEncodingMode } from '../getColorEncodingMode'
import PaletteControl from '../../shared/ui/PaletteControl'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import Slider from '../../shared/ui/Slider'
import StrokeStyleControls from '../../shared/ui/StrokeStyleControls'
import Toggle from '../../shared/ui/Toggle'
import FormatWidget from '../../shared/ui/FormatWidget'

import type { ChartFormatProps } from '../types'
import type { ScatterSymbol } from '../types'

type MarkSeriesWidgetProps = Pick<
  ChartFormatProps,
  'actions' | 'chart' | 'fields'
> & {}

const scatterSymbolOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'rect' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' },
] satisfies { label: string; value: ScatterSymbol }[]

const scatterSymbolIcons = {
  circle: Circle,
  rect: Square,
  triangle: Triangle,
  diamond: Diamond,
} satisfies Record<ScatterSymbol, typeof Circle>

/**
 * Edits color or palette and the marks of the chart type: points, lines or
 * bars.
 */
function MarkSeriesWidget({ actions, chart, fields }: MarkSeriesWidgetProps) {
  const { appearance } = chart.spec
  const hasSizeEncoding = Boolean(chart.spec.data.encoding.size)
  const colorEncodingMode = getColorEncodingMode(
    chart.type,
    chart.spec.data.encoding,
    fields,
  )
  return (
    <FormatWidget title="Mark / Series">
      {colorEncodingMode === 'constant' ? (
        <ControlRow label="Color">
          <ColorControl
            label="Chart color"
            value={appearance.color}
            onChange={(color) => {
              actions.setAppearance('color', color)
            }}
          />
        </ControlRow>
      ) : null}
      {colorEncodingMode === 'categorical' ? (
        <ControlRow label="Palette">
          <PaletteControl
            label="Categorical color palette"
            palettes={categoricalColorPalettes}
            value={appearance.colorScale.categorical.palette}
            onChange={(palette) => {
              actions.setAppearance('colorScale', {
                ...appearance.colorScale,
                categorical: {
                  ...appearance.colorScale.categorical,
                  palette,
                },
              })
            }}
          />
        </ControlRow>
      ) : null}
      {chart.type === 'scatter' ? (
        <>
          <ControlRow label="Symbol">
            <SegmentedControl
              label="Scatter symbol"
              options={scatterSymbolOptions}
              value={appearance.scatter.symbol}
              renderOption={(option) => {
                const SymbolIcon = scatterSymbolIcons[option.value]
                return <SymbolIcon aria-hidden="true" size={13} />
              }}
              onValueChange={(symbol) => {
                actions.setChartAppearance('scatter', 'symbol', symbol)
              }}
            />
          </ControlRow>
          {!hasSizeEncoding ? (
            <ControlRow label="Point size">
              <Slider
                label="Point size"
                min={4}
                max={28}
                step={1}
                value={appearance.scatter.pointSize}
                onValueChange={(pointSize) => {
                  actions.setChartAppearance('scatter', 'pointSize', pointSize)
                }}
              />
            </ControlRow>
          ) : null}
          <ControlRow label="Opacity">
            <Slider
              label="Opacity"
              min={0.1}
              max={1}
              step={0.05}
              value={appearance.scatter.opacity}
              onValueChange={(opacity) => {
                actions.setChartAppearance('scatter', 'opacity', opacity)
              }}
            />
          </ControlRow>
        </>
      ) : null}
      {chart.type === 'line' ? (
        <>
          <StrokeStyleControls
            label="Mark"
            minWidth={1}
            rowLabelPrefix="Line"
            value={appearance.line.stroke}
            onChange={(stroke) => {
              actions.setChartAppearance('line', 'stroke', stroke)
            }}
          />
          <ControlRow label="Smooth">
            <Toggle
              label="Smooth line"
              checked={appearance.line.smooth}
              onCheckedChange={(smooth) => {
                actions.setChartAppearance('line', 'smooth', smooth)
              }}
            />
          </ControlRow>
          <ControlRow label="Show points">
            <Toggle
              label="Show data points"
              checked={appearance.line.showSymbol}
              onCheckedChange={(showSymbol) => {
                actions.setChartAppearance('line', 'showSymbol', showSymbol)
              }}
            />
          </ControlRow>
          <ControlRow label="Area fill">
            <Toggle
              label="Fill area below line"
              checked={appearance.line.areaFill}
              onCheckedChange={(areaFill) => {
                actions.setChartAppearance('line', 'areaFill', areaFill)
              }}
            />
          </ControlRow>
          {appearance.line.areaFill ? (
            <div className="format-widget-subproperties">
              <ControlRow label="Color">
                <ColorControl
                  label="Area fill color"
                  value={appearance.line.areaColor}
                  onChange={(areaColor) => {
                    actions.setChartAppearance('line', 'areaColor', areaColor)
                  }}
                />
              </ControlRow>
              <ControlRow label="Opacity">
                <Slider
                  label="Area fill opacity"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={appearance.line.areaOpacity}
                  onValueChange={(areaOpacity) => {
                    actions.setChartAppearance(
                      'line',
                      'areaOpacity',
                      areaOpacity,
                    )
                  }}
                />
              </ControlRow>
            </div>
          ) : null}
        </>
      ) : null}
      {chart.type === 'bar' ? (
        <>
          <ControlRow label="Bar width">
            <Slider
              label="Bar width"
              min={8}
              max={64}
              step={2}
              value={appearance.bar.barWidth}
              onValueChange={(barWidth) => {
                actions.setChartAppearance('bar', 'barWidth', barWidth)
              }}
            />
          </ControlRow>
          <ControlRow label="Radius">
            <Slider
              label="Corner radius"
              min={0}
              max={24}
              step={1}
              value={appearance.bar.borderRadius}
              onValueChange={(borderRadius) => {
                actions.setChartAppearance('bar', 'borderRadius', borderRadius)
              }}
            />
          </ControlRow>
        </>
      ) : null}
    </FormatWidget>
  )
}

export default MarkSeriesWidget
