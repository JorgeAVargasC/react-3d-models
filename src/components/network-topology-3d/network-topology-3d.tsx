import 'aframe'
import ForceGraphVR from 'react-force-graph-vr'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import type { ISwitchDTO } from '@/api/types/switch.dto'
import type { ILinkDTO } from '@/api/types/link.dto'
import type { GraphNode, GraphLink } from '@/api/types/graph-types'
import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'

import { buildGraphData } from './build-graph'
import { envs } from '@/config/envs'
import { useGetNodeObjects } from './use-get-node-objects'
import { useGetLinksObjects } from './use-get-links-objects'

interface Props {
  switches: ISwitchDTO[]
  links: ILinkDTO[]
  linksMetrics: Record<string, ILinkMetricsDTO | undefined>
}

export const NetworkTopology3D = ({ switches, links, linksMetrics }: Props) => {
  const fgRef = useRef<any>(undefined)

  const graphData = useMemo(
    () => buildGraphData(switches, links),
    [switches, links]
  )

  const nodeObjects = useGetNodeObjects({ graphData })

  const linkObjects = useGetLinksObjects({
    graphData,
    linksMetrics
  })

  return (
    <ForceGraphVR
      ref={fgRef}
      graphData={graphData}
      nodeThreeObject={(n: GraphNode) =>
        nodeObjects.get(n.id) || new THREE.Group()
      }
      linkThreeObjectExtend
      linkThreeObject={(l: GraphLink) =>
        linkObjects.get(`${l.source}-${l.target}`) || new THREE.Group()
      }
      linkPositionUpdate={(obj, { start, end }) => {
        const mid = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2,
          z: (start.z + end.z) / 2
        }
        obj.position.set(mid.x, mid.y + 10, mid.z)
      }}
      linkColor={(l: GraphLink) =>
        l.internal ? 'gray' : envs.styles.linkColor
      }
      linkOpacity={0.5}
      linkWidth={(l: GraphLink) => (l.internal ? 0.8 : 3)}
      linkDirectionalParticles={(l: GraphLink) => (l.internal ? 3 : 6)}
      linkDirectionalParticleSpeed={0.004}
      linkDirectionalParticleWidth={1.2}
    />
  )
}
