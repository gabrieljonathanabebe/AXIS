import IconButton from '../shared/ui/IconButton'

import type { IconButtonSize } from '../shared/ui/IconButton'
import type { WorkspaceCommand } from './types'

type CommandButtonProps = {
  command: WorkspaceCommand
  size?: IconButtonSize
}

function CommandButton({ command, size = 'md' }: CommandButtonProps) {
  const Icon = command.icon

  return (
    <IconButton
      disabled={!command.isEnabled}
      label={command.label}
      size={size}
      onClick={command.run}
    >
      <Icon size={size === 'sm' ? 16 : 18} />
    </IconButton>
  )
}

export default CommandButton
