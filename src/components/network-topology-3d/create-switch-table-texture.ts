import type { SwitchNode } from '@/api/types/graph-types'
import { envs } from '@/config/envs'
import { createTableTexture } from '@/lib/create-canvas-table-texture'

export function createSwitchTableTexture(switchData: SwitchNode) {
  return createTableTexture(
    `${switchData.name}`,
    ['Port', 'Status', 'DPID', 'LOW'],
    switchData.ports.map((port) => [
      `${port.label}`,
      {
        text: port.isActive ? 'UP' : 'DOWN',
        color: port.isActive ? envs.styles.successColor : envs.styles.errorColor
      },
      `${port.dpid}`,
      `${port.number}`
    ]),
    {
      headerColor: envs.styles.switchColor
    }
  )
}
