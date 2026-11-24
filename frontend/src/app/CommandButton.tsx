import IconButton from '@/shared/ui/primitives/IconButton'
import { formatShortcut } from './formatShortcut'

import type { ButtonSize, ButtonVariant } from '@/shared/ui/primitives/Button'
import type { WorkspaceCommand } from './types'

type CommandButtonProps = {
  command: WorkspaceCommand
  size?: ButtonSize
  variant?: ButtonVariant
}

/**
 * Shows a command as an icon button, pressed while the command is active.
 * The hover title names its first shortcut, e.g. "Undo (⌘Z)".
 */
function CommandButton({
  command,
  size = 'md',
  variant = 'secondary',
}: CommandButtonProps) {
  const Icon = command.icon
  const [shortcut] = command.shortcuts
  const title = shortcut
    ? `${command.label} (${formatShortcut(shortcut)})`
    : command.label
  return (
    <IconButton
      disabled={!command.isEnabled}
      pressed={command.isActive}
      label={command.label}
      size={size}
      title={title}
      variant={variant}
      onClick={command.run}
    >
      <Icon size={size === 'sm' ? 16 : 18} />
    </IconButton>
  )
}

export default CommandButton
