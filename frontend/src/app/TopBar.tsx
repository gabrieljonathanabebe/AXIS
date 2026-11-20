import { Moon, Sun } from 'lucide-react'

import { useDocumentTheme } from '@/charts/useDocumentTheme'
import IconButton from '@/shared/ui/IconButton'

// ===== HELPERS ===============================================================
/**
 * Switches the editor theme on the document root; provisional, until a
 * real setting replaces it.
 * @param theme Theme to switch to.
 */
function setDocumentTheme(theme: 'dark' | 'light'): void {
  document.documentElement.dataset.theme = theme
}

// ===== COMPONENT =============================================================
/** Bar above the workspace: brand and, for now, the theme switch. */
function TopBar() {
  const isDark = useDocumentTheme() === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  return (
    <header className="top-bar glass glass-thin">
      <h1 className="top-bar-brand">Cevyn</h1>
      <div className="top-bar-actions">
        <IconButton
          label={`Switch to ${nextTheme} theme`}
          size="sm"
          variant="ghost"
          onClick={() => setDocumentTheme(nextTheme)}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>
      </div>
    </header>
  )
}

export default TopBar
