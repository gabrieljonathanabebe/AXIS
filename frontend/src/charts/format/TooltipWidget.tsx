import { SeparatorVertical, SquareMousePointer } from 'lucide-react'

import ControlRow from '@/shared/ui/ControlRow'
import FormatWidget from '@/shared/ui/FormatWidget'
import LayoutControls from '@/shared/ui/LayoutControls'
import NumberFormatControls from '@/shared/ui/NumberFormatControls'
import SegmentedControl from '@/shared/ui/SegmentedControl'
import SurfaceControls from '@/shared/ui/SurfaceControls'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type {
  ChartInteractionSpec,
  TooltipAppearance,
  TooltipTrigger,
} from '@/charts/types'
import type { OptionItem } from '@/shared/ui/OptionsMenu'

type TooltipWidgetProps = {
  appearance: TooltipAppearance
  onAppearanceChange: (value: TooltipAppearance) => void
  onChange: (value: ChartInteractionSpec['tooltip']) => void
  showTrigger?: boolean
  value: ChartInteractionSpec['tooltip']
}

const triggerOptions = [
  { icon: SquareMousePointer, label: 'Item', value: 'item' },
  { icon: SeparatorVertical, label: 'Axis', value: 'axis' },
] satisfies OptionItem<TooltipTrigger>[]

/**
 * Subgroups of the data tooltip in the fixed order: its padding and the
 * gap between its rows, its surface as CSS (no gradient in the border, no
 * grain) with its text after Shape, the number format of its values, then
 * what triggers it, the hovered mark or all marks at one position of the
 * axis. Whether it shows is the eye of its group in the marks; radial
 * charts have no trigger.
 */
function TooltipWidget({
  appearance,
  onAppearanceChange,
  onChange,
  showTrigger = true,
  value,
}: TooltipWidgetProps) {
  return (
    <>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Tooltip"
          maxGap={24}
          value={appearance.layout}
          onChange={(layout) => onAppearanceChange({ ...appearance, layout })}
        />
      </FormatWidget>
      <SurfaceControls
        label="Tooltip"
        renderer="css"
        value={appearance.surface}
        onChange={(key, property) => {
          onAppearanceChange({
            ...appearance,
            surface: { ...appearance.surface, [key]: property },
          })
        }}
      >
        <FormatWidget title="Text">
          <TextStyleControls
            label="Tooltip text"
            value={appearance.textStyle}
            onChange={(textStyle) => {
              onAppearanceChange({ ...appearance, textStyle })
            }}
          />
        </FormatWidget>
      </SurfaceControls>
      <FormatWidget title="Format">
        <NumberFormatControls
          label="Tooltip"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      </FormatWidget>
      {showTrigger ? (
        <FormatWidget title="Behavior">
          <ControlRow layout="wide">
            <SegmentedControl
              label="Tooltip trigger"
              options={triggerOptions}
              value={value.trigger}
              onValueChange={(trigger) => onChange({ ...value, trigger })}
            />
          </ControlRow>
        </FormatWidget>
      ) : null}
    </>
  )
}

export default TooltipWidget
