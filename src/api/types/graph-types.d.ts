import type { ISwitchDTO } from '@/api/types/switch.dto'

export type SwitchId = `${number}-${number}`
export type PortId = `${SwitchId}-${number}-${number}`

export type SwitchNode = Omit<ISwitchDTO, 'id'> & {
  id: SwitchId
  type: 'switch'
}

export type PortNode = ISwitchDTO['ports'][number] & {
  id: PortId
  type: 'port'
  parentSwitchId: SwitchId
}

export type GraphNode = SwitchNode | PortNode

export type GraphLink = {
  source: SwitchId | PortId
  target: SwitchId | PortId
  internal: boolean
}
