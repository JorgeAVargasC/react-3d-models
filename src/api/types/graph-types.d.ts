import type { ISwitchDTO } from '@/api/types/switch.dto'

export type SwitchNode = ISwitchDTO & {
  id: string
  group: string
  type: 'switch'
}

export type PortNode = ISwitchDTO['ports'][number] & {
  id: PortId
  group: string
  type: 'port'
  parentSwitchId: string
}

export type GraphNode = SwitchNode | PortNode

export type GraphLink = {
  source: string
  target: string
  internal: boolean
}
