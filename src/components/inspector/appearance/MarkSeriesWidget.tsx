import { Circle, Diamond, Paintbrush, Square, Triangle } from 'lucide-react'

import { categoricalColorPalettes } from '../../../chart/colorPalettes'
import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import { getColorEncodingMode } from '../../../chart/getColorEncodingMode'
import PaletteControl from '../../ui/PaletteControl'
import SegmentedControl from '../../ui/SegmentedControl'
import Slider from '../../ui/Slider'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type { ChartInspectorProps } from '../types'
import type { LineStyle, ScatterSymbol } from '../../../types/chart'

type MarkSeriesWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAppearance' | 'onSetChartAppearance'
>

const scatterSymbolOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'rect' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' },
] satisfies { label: string; value: ScatterSymbol }[]

const lineStyleOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
] satisfies { label: string; value: LineStyle }[]

const scatterSymbolIcons = {
  circle: Circle,
  rect: Square,
  triangle: Triangle,
  diamond: Diamond,
} satisfies Record<ScatterSymbol, typeof Circle>

function MarkSeriesWidget({
  chart,
  onSetAppearance,
  onSetChartAppearance,
}: MarkSeriesWidgetProps) {
  // CONSTANTS
  const { appearance } = chart.spec
  const hasSizeEncoding = Boolean(chart.spec.data.encoding.size)
  const colorEncodingMode = getColorEncodingMode(
    chart.type,
    chart.spec.data.encoding,
  )
  // RETURN
  return (
    <InspectorWidget title="Mark / Series" icon={<Paintbrush size={16} />}>
      {colorEncodingMode === 'constant' ? (
        <ControlRow label="Color">
          <ColorControl
            label="Chart color"
            value={appearance.color}
            onChange={(color) => {
              onSetAppearance('color', color)
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
              onSetAppearance('colorScale', {
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
                onSetChartAppearance('scatter', 'symbol', symbol)
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
                  onSetChartAppearance('scatter', 'pointSize', pointSize)
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
                onSetChartAppearance('scatter', 'opacity', opacity)
              }}
            />
          </ControlRow>
        </>
      ) : null}
      {chart.type === 'line' ? (
        <>
          <ControlRow label="Line width">
            <Slider
              label="Line width"
              min={1}
              max={8}
              step={0.5}
              value={appearance.line.lineWidth}
              onValueChange={(lineWidth) => {
                onSetChartAppearance('line', 'lineWidth', lineWidth)
              }}
            />
          </ControlRow>
          <ControlRow label="Line style">
            <SegmentedControl
              label="Line style"
              options={lineStyleOptions}
              value={appearance.line.lineStyle}
              renderOption={(option) => (
                <span
                  className="line-style-preview"
                  style={{ borderTopStyle: option.value }}
                />
              )}
              onValueChange={(lineStyle) => {
                onSetChartAppearance('line', 'lineStyle', lineStyle)
              }}
            />
          </ControlRow>
          <ControlRow label="Smooth">
            <Toggle
              label="Smooth line"
              checked={appearance.line.smooth}
              onCheckedChange={(smooth) => {
                onSetChartAppearance('line', 'smooth', smooth)
              }}
            />
          </ControlRow>
          <ControlRow label="Show points">
            <Toggle
              label="Show data points"
              checked={appearance.line.showSymbol}
              onCheckedChange={(showSymbol) => {
                onSetChartAppearance('line', 'showSymbol', showSymbol)
              }}
            />
          </ControlRow>
          <ControlRow label="Area fill">
            <Toggle
              label="Fill area below line"
              checked={appearance.line.areaFill}
              onCheckedChange={(areaFill) => {
                onSetChartAppearance('line', 'areaFill', areaFill)
              }}
            />
          </ControlRow>
          {appearance.line.areaFill ? (
            <div className="inspector-widget-subproperties">
              <ControlRow label="Color">
                <ColorControl
                  label="Area fill color"
                  value={appearance.line.areaColor}
                  onChange={(areaColor) => {
                    onSetChartAppearance('line', 'areaColor', areaColor)
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
                    onSetChartAppearance('line', 'areaOpacity', areaOpacity)
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
                onSetChartAppearance('bar', 'barWidth', barWidth)
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
                onSetChartAppearance('bar', 'borderRadius', borderRadius)
              }}
            />
          </ControlRow>
        </>
      ) : null}
    </InspectorWidget>
  )
}

export default MarkSeriesWidget
