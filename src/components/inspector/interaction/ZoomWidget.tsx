import { ZoomIn } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { ChartInteractionSpec } from '../../../types/chart'

type ZoomMode = 'off' | 'inside' | 'slider' | 'both'

type ZoomWidgetProps = {
  value: ChartInteractionSpec['zoom']
  onChange: (value: ChartInteractionSpec['zoom']) => void
}

const zoomModeOptions = [
  { label: 'Off', value: 'off' },
  { label: 'Inside', value: 'inside' },
  { label: 'Slider', value: 'slider' },
  { label: 'Both', value: 'both' },
] satisfies { label: string; value: ZoomMode }[]

function getZoomMode(value: ChartInteractionSpec['zoom']): ZoomMode {
  if (!value.enabled) {
    return 'off'
  }
  if (value.inside && value.slider) {
    return 'both'
  }
  return value.inside ? 'inside' : 'slider'
}

function ZoomWidget({ value, onChange }: ZoomWidgetProps) {
  return (
    <InspectorWidget title="Zoom" icon={<ZoomIn size={16} />}>
      <ControlRow label="Mode">
        <SelectControl
          label="Zoom mode"
          options={zoomModeOptions}
          value={getZoomMode(value)}
          onChange={(mode) => {
            onChange({
              enabled: mode !== 'off',
              inside: mode === 'inside' || mode === 'both',
              slider: mode === 'slider' || mode === 'both',
            })
          }}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default ZoomWidget
