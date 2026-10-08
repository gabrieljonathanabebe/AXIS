import Button from './Button'

export type PaletteOption = {
  label: string
  colors: readonly string[]
}

type PaletteControlProps = {
  label: string
  palettes: PaletteOption[]
  value: string[]
  onChange: (colors: string[]) => void
}

function normalizeColor(color: string): string {
  return color.trim().toLowerCase()
}

function palettesMatch(
  currentColors: string[],
  paletteColors: readonly string[],
): boolean {
  return (
    currentColors.length === paletteColors.length &&
    currentColors.every((color, index) => {
      return normalizeColor(color) === normalizeColor(paletteColors[index])
    })
  )
}

function PaletteControl({
  label,
  palettes,
  value,
  onChange,
}: PaletteControlProps) {
  return (
    <div className="palette-control" role="radiogroup" aria-label={label}>
      {palettes.map((palette) => {
        const isActive = palettesMatch(value, palette.colors)

        return (
          <Button
            className="palette-control-option"
            role="radio"
            aria-label={palette.label}
            aria-checked={isActive}
            title={palette.label}
            isActive={isActive}
            onClick={() => {
              onChange([...palette.colors])
            }}
            key={palette.label}
          >
            <span className="palette-control-preview" aria-hidden="true">
              {palette.colors.map((color, index) => (
                <span
                  className="palette-control-swatch"
                  style={{ backgroundColor: color }}
                  key={`${color}-${index}`}
                />
              ))}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default PaletteControl
