import { MessageSquareText, Sparkles, ZoomIn } from 'lucide-react'

import ControlRow from '../ui/ControlRow'
import SegmentedControl from '../ui/SegmentedControl'
import SelectControl from '../ui/SelectControl'
import Slider from '../ui/Slider'
import Toggle from '../ui/Toggle'
import InspectorWidget from './InspectorWidget'

import type { ChartInteractionSpec, TooltipTrigger } from '../../types/chart'
import type { ChartInspectorProps } from './types'

type InteractionInspectorTabProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetInteraction'
>

type ZoomMode = 'off' | 'inside' | 'slider' | 'both'

const tooltipTriggerOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Axis', value: 'axis' },
] satisfies { label: string; value: TooltipTrigger }[]

const zoomModeOptions = [
  { label: 'Off', value: 'off' },
  { label: 'Inside', value: 'inside' },
  { label: 'Slider', value: 'slider' },
  { label: 'Both', value: 'both' },
] satisfies { label: string; value: ZoomMode }[]

function getZoomMode(zoom: ChartInteractionSpec['zoom']): ZoomMode {
  if (!zoom.enabled) {
    return 'off'
  }
  if (zoom.inside && zoom.slider) {
    return 'both'
  }
  return zoom.inside ? 'inside' : 'slider'
}

function InteractionInspectorTab({
  chart,
  onSetInteraction,
}: InteractionInspectorTabProps) {
  const { interaction } = chart.spec

  return (
    <div className="stack inspector-tab-content">
      <InspectorWidget title="Tooltip" icon={<MessageSquareText size={16} />}>
        <ControlRow label="Enabled">
          <Toggle
            label="Show tooltip"
            checked={interaction.tooltip.enabled}
            onCheckedChange={(enabled) => {
              onSetInteraction('tooltip', {
                ...interaction.tooltip,
                enabled,
              })
            }}
          />
        </ControlRow>

        {interaction.tooltip.enabled ? (
          <div className="inspector-widget-subproperties">
            <ControlRow label="Trigger">
              <SegmentedControl
                label="Tooltip trigger"
                options={tooltipTriggerOptions}
                value={interaction.tooltip.trigger}
                onValueChange={(trigger) => {
                  onSetInteraction('tooltip', {
                    ...interaction.tooltip,
                    trigger,
                  })
                }}
              />
            </ControlRow>
          </div>
        ) : null}
      </InspectorWidget>

      <InspectorWidget title="Zoom" icon={<ZoomIn size={16} />}>
        <ControlRow label="Mode">
          <SelectControl
            label="Zoom mode"
            options={zoomModeOptions}
            value={getZoomMode(interaction.zoom)}
            onChange={(mode) => {
              onSetInteraction('zoom', {
                enabled: mode !== 'off',
                inside: mode === 'inside' || mode === 'both',
                slider: mode === 'slider' || mode === 'both',
              })
            }}
          />
        </ControlRow>
      </InspectorWidget>

      <InspectorWidget title="Animation" icon={<Sparkles size={16} />}>
        <ControlRow label="Enabled">
          <Toggle
            label="Enable animation"
            checked={interaction.animation.enabled}
            onCheckedChange={(enabled) => {
              onSetInteraction('animation', {
                ...interaction.animation,
                enabled,
              })
            }}
          />
        </ControlRow>

        {interaction.animation.enabled ? (
          <div className="inspector-widget-subproperties">
            <ControlRow label="Duration">
              <Slider
                label="Animation duration"
                min={0}
                max={2000}
                step={50}
                value={interaction.animation.duration}
                onValueChange={(duration) => {
                  onSetInteraction('animation', {
                    ...interaction.animation,
                    duration,
                  })
                }}
              />
            </ControlRow>
          </div>
        ) : null}
      </InspectorWidget>
    </div>
  )
}

export default InteractionInspectorTab
