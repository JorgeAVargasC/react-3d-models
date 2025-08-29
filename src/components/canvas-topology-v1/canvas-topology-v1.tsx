import * as THREE from 'three'
import ForceGraph3D, {
  type ForceGraphMethods,
  type LinkObject,
  type NodeObject
} from 'react-force-graph-3d'
import { useEffect, useRef, useState } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import type { ISwitchDTO } from '@/api/types/switch.dto'
import type { ILinkDTO } from '@/api/types/link.dto'
import type { GraphNode, GraphLink } from '@/api/types/graph-types'

import SpriteText from 'three-spritetext'
import { getSwitchDataHTML } from './get-switch-data-html'
import { buildGraphData } from '@/api/functions/build-graph'
import { getPortDataHTML } from './get-node-data-html'

interface Props {
  switches: ISwitchDTO[]
  links: ILinkDTO[]
}

type IRef =
  | ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>
  | undefined

export const CanvasTopologyV1 = ({ switches, links }: Props) => {
  const fgRef = useRef<IRef>(undefined)
  const [custom3dObj, setCustom3dObj] = useState<THREE.Object3D | null>(null)

  const data = buildGraphData(switches, links)

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge')?.strength(-150)
    }
  }, [])

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/3d/router/source/lyq.glb', (gltf) => {
      const object = gltf.scene
      object.scale.set(1, 1, 1)
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      setCustom3dObj(object)
    })
  }, [])

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      backgroundColor='#00000000'
      nodeThreeObject={(node: GraphNode) => {
        const group = new THREE.Group()

        if (node.type === 'switch') {
          const sw = node

          if (custom3dObj) {
            group.add(custom3dObj.clone(true))
          } else {
            group.add(
              new THREE.Mesh(
                new THREE.BoxGeometry(6, 6, 6),
                new THREE.MeshStandardMaterial({ color: 'blue' })
              )
            )
          }

          const label = new SpriteText(sw.name, 10)
          label.color = 'cyan'
          label.position.set(0, 10, 0)
          group.add(label)
        }

        if (node.type === 'port') {
          const port = node

          group.add(
            new THREE.Mesh(
              new THREE.SphereGeometry(3, 16, 16),
              new THREE.MeshStandardMaterial({
                color: port.isActive ? 'lime' : 'red'
              })
            )
          )

          const label = new SpriteText(port.label, 5)
          label.color = 'yellow'
          label.position.set(0, 4, 0)
          group.add(label)
        }

        return group
      }}
      nodeLabel={(node: GraphNode) => {
        if (node.type === 'switch') {
          return getSwitchDataHTML(node)
        }
        if (node.type === 'port') {
          return getPortDataHTML(node)
        }
        return ''
      }}
      linkColor={(link: GraphLink) =>
        link.internal ? 'gray' : 'rgb(14, 230, 43)'
      }
      linkOpacity={0.5}
      linkWidth={(link: GraphLink) => (link.internal ? 0.8 : 1)}
      linkDirectionalParticles={(link: GraphLink) => (link.internal ? 1 : 2)}
      linkDirectionalParticleSpeed={0.004}
      linkDirectionalParticleWidth={1.2}
    />
  )
}
