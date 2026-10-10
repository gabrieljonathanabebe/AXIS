import IconButton from '../shared/ui/IconButton'

import type { IconButtonSize, IconButtonVariant } from '../shared/ui/IconButton'
import type { WorkspaceCommand } from './types'

type CommandButtonProps = {
  command: WorkspaceCommand
  size?: IconButtonSize
  variant?: IconButtonVariant
}

function CommandButton({
  command,
  size = 'md',
  variant = 'default',
}: CommandButtonProps) {
  const Icon = command.icon

  return (
    <IconButton
      disabled={!command.isEnabled}
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
