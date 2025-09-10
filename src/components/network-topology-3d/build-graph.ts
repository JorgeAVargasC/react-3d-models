import type {
  GraphLink,
  GraphNode,
  PortNode,
  SwitchNode
} from '@/api/types/graph-types'
import type { ILinkDTO } from '@/api/types/link.dto'
import type { ISwitchDTO } from '@/api/types/switch.dto'
import { COLORS } from '@/constants/colors'
import { logger } from '@/helpers/logger'

export const buildGraphData = (
  switches: ISwitchDTO[],
  links: ILinkDTO[]
): { nodes: GraphNode[]; links: GraphLink[] } => {
  const nodes: GraphNode[] = []
  const newLinks: GraphLink[] = []

  switches.forEach((sw) => {
    const switchId: string = sw.switchId.toString()

    const switchNode: SwitchNode = {
      id: switchId,
      type: 'switch',
      group: switchId,
      ...sw
    }

    nodes.push(switchNode)

    sw.ports.forEach((port) => {
      const portId = `${switchId}-${port.number}`

      const portNode: PortNode = {
        id: portId,
        type: 'port',
        parentSwitchId: switchId,
        group: switchId,
        ...port
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
    const sourceSwitchId = `${lnk.sourceSwitch}`
    const targetSwitchId = `${lnk.targetSwitch}`

    const sourcePortId = `${sourceSwitchId}-${lnk.sourcePort}`
    const targetPortId = `${targetSwitchId}-${lnk.targetPort}`

    const portToPort: GraphLink = {
      source: sourcePortId,
      target: targetPortId,
      internal: false
    }
    newLinks.push(portToPort)
  })

  // Add new node with a root switch connected to all switches through every port 0
  nodes.push({
    id: 'root',
    type: 'switch',
    group: 'root',
    switchId: 0,
    name: 'Controller',
    ports: []
  })

  // create links from root to all ports 0
  nodes.forEach((node) => {
    if (node.type === 'port' && node.number === -2) {
      const rootToSwitch: GraphLink = {
        source: 'root',
        target: node.id,
        internal: true
      }
      newLinks.push(rootToSwitch)
    }
  })

  logger('[buildGraphData]', COLORS.INDIGO)
  console.log('nodes', [...nodes])
  console.log('links', [...newLinks])

  return { nodes, links: newLinks }
}
