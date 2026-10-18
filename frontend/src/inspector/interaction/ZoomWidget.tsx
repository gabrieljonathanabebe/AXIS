import { ZoomIn } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import SelectControl from '../../shared/ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { InspectorWidgetVariant } from '../InspectorWidget'
import type { ChartInteractionSpec } from '../../charts/types'

type ZoomMode = 'inside' | 'slider' | 'both'

type ZoomWidgetProps = {
  value: ChartInteractionSpec['zoom']
  onChange: (value: ChartInteractionSpec['zoom']) => void
  variant?: InspectorWidgetVariant
}

const zoomModeOptions = [
  { label: 'Inside', value: 'inside' },
  { label: 'Slider', value: 'slider' },
  { label: 'Both', value: 'both' },
] satisfies { label: string; value: ZoomMode }[]

function getZoomMode(value: ChartInteractionSpec['zoom']): ZoomMode {
  if (value.inside && value.slider) {
    return 'both'
  }
  return value.slider ? 'slider' : 'inside'
}

/** Edits whether the X axis zooms and scrolls inside the plot, by slider or both. */
function ZoomWidget({ value, onChange, variant }: ZoomWidgetProps) {
  return (
    <InspectorWidget
      title="Zoom & Scroll"
      icon={<ZoomIn size={16} />}
      visibility={{
        label: 'Enabled',
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({
            ...value,
            enabled,
            inside:
              enabled && !value.inside && !value.slider ? true : value.inside,
          })
        },
      }}
      variant={variant}
    >
      <ControlRow label="Mode">
        <SelectControl
          label="Zoom mode"
          options={zoomModeOptions}
          value={getZoomMode(value)}
          onChange={(mode) => {
            onChange({
              ...value,
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
