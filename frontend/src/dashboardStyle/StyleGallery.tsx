import ContainerSurface from '../objects/ContainerSurface'
import { getContainerSurfaceStyle } from '../objects/containerSurfaceStyle'
import { getFillsCss } from '../shared/fill'
import { createDashboardStyle } from './createDashboardStyle'

import type { CSSProperties, ReactNode } from 'react'
import type { ContainerSurfaceValue } from '../objects/containerSurfaceStyle'
import type { StyleRecipe } from './types'

// ===== TYPES =================================================================
type StyleGalleryProps = {
  recipes: StyleRecipe[]
  value: StyleRecipe
  onApply: (recipe: StyleRecipe) => void
}

type StylePreviewProps = {
  recipe: StyleRecipe
}

type PreviewContainerProps = {
  children: ReactNode
  className?: string
  surface: ContainerSurfaceValue
}

type StylePreviewStyle = CSSProperties & {
  '--style-preview-accent': string
  '--style-preview-canvas': string
  '--style-preview-text': string
  '--style-preview-text-muted': string
}

// ===== CONSTANTS =============================================================
/** Corner radius of the containers in a preview, scaled to its size. */
const PREVIEW_RADIUS = 6

/** Data colors a preview shows as bars of its chart. */
const PREVIEW_BAR_COUNT = 4

// ===== COMPONENTS ============================================================
/**
 * One container of a preview with the real layers of the material, so
 * frosted blur, grain and the light edge of glass look as on the canvas.
 * @param props Surface of the style and the content of the container.
 */
function PreviewContainer({
  children,
  className = '',
  surface,
}: PreviewContainerProps) {
  return (
    <span
      className={`container-surface style-preview-container ${className}`}
      style={getContainerSurfaceStyle(surface)}
    >
      <ContainerSurface surface={surface}>{children}</ContainerSurface>
    </span>
  )
}

/**
 * Mini dashboard of one style, drawn live from its recipe: its canvas,
 * three containers of its material and the colors of texts, data and
 * accent inside them.
 * @param props Recipe of the style.
 */
function StylePreview({ recipe }: StylePreviewProps) {
  const style = createDashboardStyle(recipe)
  const surface = { ...style.container, borderRadius: PREVIEW_RADIUS }
  const previewStyle: StylePreviewStyle = {
    '--style-preview-accent': style.colors.accent,
    '--style-preview-canvas': getFillsCss(style.canvas.background),
    '--style-preview-text': style.colors.text,
    '--style-preview-text-muted': style.colors.textMuted,
  }
  return (
    <span aria-hidden="true" className="style-preview" style={previewStyle}>
      <PreviewContainer className="is-chart" surface={surface}>
        <span className="style-preview-bars">
          {style.palette.slice(0, PREVIEW_BAR_COUNT).map((color) => (
            <span
              className="style-preview-bar"
              key={color}
              style={{ background: color }}
            />
          ))}
        </span>
      </PreviewContainer>
      <PreviewContainer surface={surface}>
        <span className="style-preview-text" />
        <span className="style-preview-text is-muted" />
      </PreviewContainer>
      <PreviewContainer surface={surface}>
        <span className="style-preview-accent" />
      </PreviewContainer>
    </span>
  )
}

/**
 * Gallery of dashboard styles: one tile per recipe with its live preview
 * and name. A click applies the style as one undo step; the current one
 * is marked.
 * @param props Recipes, current recipe and the apply handler.
 */
function StyleGallery({ recipes, value, onApply }: StyleGalleryProps) {
  return (
    <div className="style-gallery">
      {recipes.map((recipe) => {
        const isActive = recipe.name === value.name
        return (
          <button
            aria-pressed={isActive}
            className={`style-gallery-tile ${isActive ? 'is-active' : ''}`}
            key={recipe.name}
            type="button"
            onClick={() => onApply(recipe)}
          >
            <StylePreview recipe={recipe} />
            <span className="style-gallery-name">{recipe.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default StyleGallery
