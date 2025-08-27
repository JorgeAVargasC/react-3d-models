import type { ILinkDTO } from '@/api/types/link.dto'
import type { ISwitchDTO } from '@/api/types/switch.dto'
import { useEffect, useRef } from 'react'
import ForceGraph3D, {
  type ForceGraphMethods,
  type LinkObject
} from 'react-force-graph-3d'
import * as THREE from 'three'

type IRef =
  | ForceGraphMethods<any, LinkObject<any, { source: number; target: number }>>
  | undefined

interface Props {
  switches: ISwitchDTO[]
  links: ILinkDTO[]
}

export const CanvasTopologyV1 = ({ switches, links }: Props) => {
  const fgRef = useRef<IRef>(undefined)

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge')?.strength(-80)
    }
  }, [])

  const data = {
    nodes: switches.map((s) => ({ ...s, id: s.id })), // asegura que hay id
    links: links.map((l) => ({ ...l, source: l.source, target: l.target })) // asegura source/target
  }

  const colorMap = new Map<number, THREE.Color>()
  function getNodeColor(id: number) {
    if (!colorMap.has(id)) {
      colorMap.set(id, new THREE.Color(Math.random() * 0xffffff))
    }
    return colorMap.get(id)!
  }

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      nodeThreeObject={(node: any) => {
        const geometry = new THREE.SphereGeometry(node.val || 4, 16, 16)
        const material = new THREE.MeshStandardMaterial({
          color: getNodeColor(node.id),
          transparent: true,
          opacity: 0.9
        })
        return new THREE.Mesh(geometry, material)
      }}
      linkColor={() => 'rgba(230, 255, 208, 0.3)'}
      linkOpacity={0.5}
      linkWidth={0.5}
      linkDirectionalParticles={1}
      linkDirectionalParticleSpeed={0.003}
      linkDirectionalParticleWidth={1}
      backgroundColor='#00000000'
      onNodeClick={(node: any) => {
        const distance = 40
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
        fgRef.current!.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
          },
          node,
          3000
        )
      }}
    />
  )
}
