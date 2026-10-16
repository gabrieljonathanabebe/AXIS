import IconButton from '../shared/ui/IconButton'
import { formatShortcut } from './formatShortcut'

import type { IconButtonSize, IconButtonVariant } from '../shared/ui/IconButton'
import type { WorkspaceCommand } from './types'

type CommandButtonProps = {
  command: WorkspaceCommand
  size?: IconButtonSize
  variant?: IconButtonVariant
}

/**
 * Shows a command as an icon button, pressed while the command is active.
 * The hover title names its first shortcut, e.g. "Undo (⌘Z)".
 */
function CommandButton({
  command,
  size = 'md',
  variant = 'default',
}: CommandButtonProps) {
  const Icon = command.icon
  const [shortcut] = command.shortcuts
  const title = shortcut
    ? `${command.label} (${formatShortcut(shortcut)})`
    : command.label
  return (
    <IconButton
      aria-pressed={command.isActive}
      disabled={!command.isEnabled}
      isActive={command.isActive}
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
