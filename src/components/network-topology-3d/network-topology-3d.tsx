import 'aframe'
import ForceGraphVR from 'react-force-graph-vr'
import * as THREE from 'three'

import type { GraphNode, GraphLink } from '@/api/types/graph-types'

import { envs } from '@/config/envs'

interface Props {
  graphData: {
    nodes: GraphNode[]
    links: GraphLink[]
  }
  nodeObjects: Map<string, any>
  linkObjects: Map<string, THREE.Object3D<THREE.Object3DEventMap>>
}

export const NetworkTopology3D = ({
  graphData,
  linkObjects,
  nodeObjects
}: Props) => {
  return (
    <ForceGraphVR
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
