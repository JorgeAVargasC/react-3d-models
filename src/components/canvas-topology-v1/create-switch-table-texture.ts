import type { SwitchNode } from '@/api/types/graph-types'
import { createTableTexture } from '@/lib/create-canvas-table-texture'

export function createSwitchTableTexture(switchData: SwitchNode) {
  return createTableTexture(
    `${switchData.name}`,
    ['Port', 'Status', 'DPID', 'LOW'],
    switchData.ports.map((port) => [
      `${port.label}`,
      {
        text: port.isActive ? 'UP' : 'DOWN',
        color: port.isActive ? '#10b981' : '#f43f5e'
      },
      `${port.dpid}`,
      `${port.number}`
    ]),
    {
      headerColor: 'cyan'
    }
  )
}
