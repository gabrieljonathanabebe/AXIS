import { Grid2X2, Paintbrush, Type } from 'lucide-react'

import ColorSwatchPicker from '../ui/ColorSwatchPicker'
import ControlRow from '../ui/ControlRow'
import IconButton from '../ui/IconButton'
import Slider from '../ui/Slider'
import TextInput from '../ui/TextInput'
import Toggle from '../ui/Toggle'
import InspectorWidget from './InspectorWidget'

import type { ChartInspectorProps } from './types'

type AppearanceInspectorTabProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAppearance' | 'onSetChartAppearance'
>

const colorOptions = [
  { label: 'Electric Blue', value: '#1e90ff' },
  { label: 'Cyan', value: '#22d3ee' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Mint', value: '#34d399' },
  { label: 'Rose', value: '#fb7185' },
  { label: 'Amber', value: '#f59e0b' },
] satisfies { label: string; value: string }[]

function AppearanceInspectorTab({
  chart,
  onSetAppearance,
  onSetChartAppearance,
}: AppearanceInspectorTabProps) {
  const { appearance } = chart.spec

  return (
    <div className="stack inspector-tab-content">
      <InspectorWidget title="Chart title" icon={<Type size={16} />}>
        <ControlRow label="Enabled">
          <Toggle
            label="Show chart title"
            checked={appearance.title.enabled}
            onCheckedChange={(enabled) => {
              onSetAppearance('title', {
                ...appearance.title,
                enabled,
              })
            }}
          />
        </ControlRow>

        {appearance.title.enabled ? (
          <div className="inspector-widget-subproperties">
            <ControlRow label="Text">
              <TextInput
                label="Chart title"
                value={appearance.title.text}
                placeholder="Automatic"
                onValueChange={(text) => {
                  onSetAppearance('title', {
                    ...appearance.title,
                    text,
                  })
                }}
              />
            </ControlRow>
          </div>
        ) : null}
      </InspectorWidget>

      <InspectorWidget title="Mark / Series" icon={<Paintbrush size={16} />}>
        <ControlRow label="Color">
          <ColorSwatchPicker
            label="Chart color"
            options={colorOptions}
            value={appearance.color}
            onChange={(value) => {
              onSetAppearance('color', value)
            }}
          />
        </ControlRow>

        {chart.type === 'scatter' ? (
          <>
            <ControlRow label="Point size">
              <Slider
                label="Point size"
                min={4}
                max={28}
                step={1}
                value={appearance.scatter.pointSize}
                onValueChange={(value) => {
                  onSetChartAppearance('scatter', 'pointSize', value)
                }}
              />
            </ControlRow>
            <ControlRow label="Opacity">
              <Slider
                label="Opacity"
                min={0.1}
                max={1}
                step={0.05}
                value={appearance.scatter.opacity}
                onValueChange={(value) => {
                  onSetChartAppearance('scatter', 'opacity', value)
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
                onValueChange={(value) => {
                  onSetChartAppearance('line', 'lineWidth', value)
                }}
              />
            </ControlRow>
            <ControlRow label="Smooth">
              <Toggle
                label="Smooth line"
                checked={appearance.line.smooth}
                onCheckedChange={(checked) => {
                  onSetChartAppearance('line', 'smooth', checked)
                }}
              />
            </ControlRow>
            <ControlRow label="Show points">
              <Toggle
                label="Show data points"
                checked={appearance.line.showSymbol}
                onCheckedChange={(checked) => {
                  onSetChartAppearance('line', 'showSymbol', checked)
                }}
              />
            </ControlRow>
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
                onValueChange={(value) => {
                  onSetChartAppearance('bar', 'barWidth', value)
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
                onValueChange={(value) => {
                  onSetChartAppearance('bar', 'borderRadius', value)
                }}
              />
            </ControlRow>
          </>
        ) : null}
      </InspectorWidget>

      <InspectorWidget title="Grid" icon={<Grid2X2 size={16} />}>
        <ControlRow label="Enabled">
          <IconButton
            size="sm"
            label={appearance.grid.enabled ? 'Hide grid' : 'Show grid'}
            isActive={appearance.grid.enabled}
            onClick={() => {
              onSetAppearance('grid', {
                ...appearance.grid,
                enabled: !appearance.grid.enabled,
              })
            }}
          >
            <Grid2X2 size={15} />
          </IconButton>
        </ControlRow>
      </InspectorWidget>
    </div>
  )
}

export default AppearanceInspectorTab
