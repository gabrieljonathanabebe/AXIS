import IconButton from '../shared/ui/IconButton'

import type { IconButtonSize, IconButtonVariant } from '../shared/ui/IconButton'
import type { WorkspaceCommand } from './types'

type CommandButtonProps = {
  command: WorkspaceCommand
  size?: IconButtonSize
  variant?: IconButtonVariant
}

/** Shows a command as an icon button, pressed while the command is active. */
function CommandButton({
  command,
  size = 'md',
  variant = 'default',
}: CommandButtonProps) {
  const Icon = command.icon
  return (
    <IconButton
      aria-pressed={command.isActive}
      disabled={!command.isEnabled}
      isActive={command.isActive}
      label={command.label}
      size={size}
      variant={variant}
      onClick={command.run}
    >
      <Icon size={size === 'sm' ? 16 : 18} />
    </IconButton>
  )
}

export default CommandButton
