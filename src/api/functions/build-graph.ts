import type {
  GraphLink,
  GraphNode,
  PortId,
  SwitchId,
  SwitchNode,
  PortNode
} from '../types/graph-types'
import type { ILinkDTO } from '../types/link.dto'
import type { ISwitchDTO } from '../types/switch.dto'

export const buildGraphData = (
  switches: ISwitchDTO[],
  links: ILinkDTO[]
): { nodes: GraphNode[]; links: GraphLink[] } => {
  const nodes: GraphNode[] = []
  const newLinks: GraphLink[] = []

  switches.forEach((sw) => {
    const switchId: SwitchId = `${sw.switchPort.low}-${sw.switchPort.high}`

    const switchNode: SwitchNode = {
      ...sw,
      id: switchId,
      type: 'switch'
    }
    nodes.push(switchNode)

    sw.ports.forEach((port) => {
      const portId: PortId = `${switchId}-${port.low}-${port.high}`

      const portNode: PortNode = {
        ...port,
        id: portId,
        type: 'port',
        parentSwitchId: switchId
      }
      nodes.push(portNode)

      const switchToPort: GraphLink = {
        source: switchId,
        target: portId,
        internal: true
      }
      newLinks.push(switchToPort)
    })
  })

  links.forEach((lnk) => {
    const sourceSwitchId: SwitchId = `${lnk.sourceSwitch.low}-${lnk.sourceSwitch.high}`
    const targetSwitchId: SwitchId = `${lnk.targetSwitch.low}-${lnk.targetSwitch.high}`

    const sourcePortId: PortId = `${sourceSwitchId}-${lnk.sourcePort.low}-${lnk.sourcePort.high}`
    const targetPortId: PortId = `${targetSwitchId}-${lnk.targetPort.low}-${lnk.targetPort.high}`

    const portToPort: GraphLink = {
      source: sourcePortId,
      target: targetPortId,
      internal: false
    }
    newLinks.push(portToPort)
  })

  return { nodes, links: newLinks }
}
