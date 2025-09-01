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
import { getSwitchDataTooltipHTML } from './get-switch-data-html'
import { getPortDataTooltipHTML } from './get-node-data-html'
import { buildGraphData } from './build-graph'
import api from '@/api/api'
import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'
import { createLinksTableTexture } from './create-links-table-texture'
import { createSwitchTableTexture } from './create-switch-table-texture'

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

  const [linkMetrics, setLinkMetrics] = useState<
    Record<string, ILinkMetricsDTO>
  >({})

  const fetchMetrics = async () => {
    const results: Record<string, ILinkMetricsDTO> = {}
    for (const l of links) {
      const m = await api.getLinkMetrics(l.sourceSwitch, l.targetSwitch)
      results[
        `${l.sourceSwitch}-${l.sourcePort}-${l.targetSwitch}-${l.targetPort}`
      ] = m
    }

    setLinkMetrics(results)
  }

  useEffect(() => {
    fetchMetrics()
  }, [links])

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

  if (Object.keys(linkMetrics).length === 0) {
    return <></>
  }

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

          // Floating Table
          const tableTexture = createSwitchTableTexture(sw)

          const materials = [
            new THREE.MeshStandardMaterial({ color: '#111' }), // side X+
            new THREE.MeshStandardMaterial({ color: '#111' }), // side X-
            new THREE.MeshStandardMaterial({ color: '#111' }), // side Y+
            new THREE.MeshStandardMaterial({ color: '#111' }), // side Y-
            new THREE.MeshStandardMaterial({
              map: tableTexture,
              transparent: true
            }),
            new THREE.MeshStandardMaterial({ color: '#222' })
          ]

          const tableMesh = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 2),
            materials
          )

          tableMesh.position.set(0, 25, 0) // más arriba
          tableMesh.onBeforeRender = (_, __, camera) => {
            tableMesh.lookAt(camera.position)
          }
          tableMesh.lookAt(new THREE.Vector3(0, 0, 0)) // opcional: orientado a cámara

          group.add(tableMesh)

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
          return getSwitchDataTooltipHTML(node)
        }
        if (node.type === 'port') {
          return getPortDataTooltipHTML(node)
        }
        return ''
      }}
      // Links

      linkThreeObjectExtend={true}
      linkThreeObject={(link: GraphLink) => {
        if (link.internal) return new THREE.Group()

        const linkKey = `${link.source}-${link.target}`
        const currentLinkMetric = linkMetrics[linkKey]

        if (!currentLinkMetric) return new THREE.Group()

        const group = new THREE.Group()

        // Floating Table
        const tableTexture = createLinksTableTexture(currentLinkMetric)

        const materials = [
          new THREE.MeshStandardMaterial({ color: '#FFF' }),
          new THREE.MeshStandardMaterial({ color: '#FFF' }),
          new THREE.MeshStandardMaterial({ color: '#FFF' }),
          new THREE.MeshStandardMaterial({ color: '#FFF' }),
          new THREE.MeshStandardMaterial({
            map: tableTexture,
            transparent: true
          }),
          new THREE.MeshStandardMaterial({ color: '#222' })
        ]

        const tableMesh = new THREE.Mesh(
          new THREE.BoxGeometry(60, 30, 2),
          materials
        )

        tableMesh.position.set(0, 25, 0)
        tableMesh.onBeforeRender = (_, __, camera) => {
          tableMesh.lookAt(camera.position)
        }

        group.add(tableMesh)

        return group
      }}
      linkPositionUpdate={(obj, { start, end }) => {
        const mid = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2,
          z: (start.z + end.z) / 2
        }

        obj.position.set(mid.x, mid.y + 10, mid.z)
      }}
      linkColor={(link: GraphLink) =>
        link.internal ? 'gray' : 'rgb(14, 230, 43)'
      }
      linkOpacity={0.5}
      linkWidth={(link: GraphLink) => (link.internal ? 0.8 : 3)}
      linkDirectionalParticles={(link: GraphLink) => (link.internal ? 3 : 6)}
      linkDirectionalParticleSpeed={0.004}
      linkDirectionalParticleWidth={1.2}
    />
  )
}
