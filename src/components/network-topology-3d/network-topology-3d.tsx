import * as THREE from 'three'

import ForceGraphVR from 'react-force-graph-vr'

import { useEffect, useMemo, useRef, useState } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import SpriteText from 'three-spritetext'

import type { ISwitchDTO } from '@/api/types/switch.dto'
import type { ILinkDTO } from '@/api/types/link.dto'
import type { GraphNode, GraphLink } from '@/api/types/graph-types'
import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'

import { buildGraphData } from './build-graph'
import { getSwitchDataTooltipHTML } from './get-switch-data-tooltip-html'
import { getPortDataTooltipHTML } from './get-node-data-tooltip-html'
import { createLinksTableTexture } from './create-links-table-texture'
import { createSwitchTableTexture } from './create-switch-table-texture'
import { envs } from '@/config/envs'

interface Props {
  switches: ISwitchDTO[]
  links: ILinkDTO[]
  linksMetrics: Record<string, ILinkMetricsDTO | undefined>
}

// type IRef =
//   | ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>
//   | undefined

export const NetworkTopology3D = ({ switches, links, linksMetrics }: Props) => {
  const fgRef = useRef<any>(undefined)

  const [custom3dObj, setCustom3dObj] = useState<THREE.Object3D | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)

  const nodeTablesRef = useRef<Record<string, THREE.Mesh | null>>({})
  const linkTablesRef = useRef<Record<string, THREE.Mesh | null>>({})

  const data = useMemo(() => buildGraphData(switches, links), [switches, links])

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge')?.strength(-15)
    }
  }, [])

  // Cargar modelo 3D opcional para switches
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

  useEffect(() => {
    Object.entries(nodeTablesRef.current).forEach(([id, mesh]) => {
      if (!mesh) return
      // Solo controlar la visibilidad de la TABLA, no del nodo completo
      mesh.visible = selectedNodeId ? selectedNodeId === id : false
    })
  }, [selectedNodeId])

  useEffect(() => {
    Object.entries(linkTablesRef.current).forEach(([id, mesh]) => {
      if (!mesh) return
      mesh.visible = selectedLinkId ? selectedLinkId === id : false
    })
  }, [selectedLinkId])

  // useEffect(() => {
  //   console.log('Toggle node', selectedNodeId, nodeObjects.get(selectedNodeId))
  // }, [selectedNodeId])

  // Objetos 3D de nodos (switch | port). No se recrean por selección.
  const nodeObjects = useMemo(() => {
    const map = new Map<string, THREE.Object3D>()

    data.nodes.forEach((node) => {
      const nodeGroup = new THREE.Group()
      const tableGroup = new THREE.Group()

      // // Load switch node with custom 3d model
      // if (node.type === 'switch' && custom3dObj && envs.apiMode === 'prod') {
      //   nodeGroup.add(custom3dObj.clone(true))
      // }

      // Load switch node with fallback 3d model
      if (node.type === 'switch' && (!custom3dObj || envs.apiMode === 'dev')) {
        const fallback3DModel = new THREE.Mesh(
          new THREE.BoxGeometry(20, 6, 20),
          new THREE.MeshStandardMaterial({ color: envs.styles.switchColor })
        )
        nodeGroup.add(fallback3DModel)
      }

      // Load switch node with floating table
      if (node.type === 'switch') {
        const tableTexture = createSwitchTableTexture(node)

        const tableMat = new THREE.MeshStandardMaterial({
          map: tableTexture,
          transparent: true,
          opacity: 1
        })

        const materials: THREE.Material[] = [
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#00fff2' }),
          // tableMat, // 👈 solo esta cara tendrá la textura
          new THREE.MeshStandardMaterial({ color: '#222' })
        ]
        const tableMesh = new THREE.Mesh(
          new THREE.BoxGeometry(60, 30, 2),
          materials
        )
        tableMesh.position.set(0, 30, 0)
        tableMesh.onBeforeRender = (_, __, camera) => {
          tableMesh.lookAt(camera.position)
        }
        tableGroup.add(tableMesh)

        nodeTablesRef.current[node.id] = tableMesh
      }

      if (node.type === 'switch') {
        const label = new SpriteText(node.name, 10)
        label.color = envs.styles.switchColor
        label.position.set(0, 10, 0)
        nodeGroup.add(label)
      }

      // Load port node

      if (node.type === 'port') {
        nodeGroup.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(3, 16, 16),
            new THREE.MeshStandardMaterial({
              color: node.isActive
                ? envs.styles.successColor
                : envs.styles.errorColor
            })
          )
        )
        const label = new SpriteText(node.label, 5)
        label.color = node.isActive
          ? envs.styles.successColor
          : envs.styles.errorColor
        label.position.set(0, 4, 0)
        nodeGroup.add(label)
      }

      const rootGroup = new THREE.Group()
      // rootGroup.add(nodeGroup)
      rootGroup.add(tableGroup)

      map.set(node.id, rootGroup)
    })

    return map
  }, [data, custom3dObj])

  // Objetos 3D de links (solo entre puertos). No se recrean por selección.
  const linkObjects = useMemo(() => {
    const map = new Map<string, THREE.Object3D>()

    data.links.forEach((link) => {
      if (link.internal) {
        map.set(`${link.source}-${link.target}`, new THREE.Group())
        return
      }

      const key = `${link.source}-${link.target}`
      const metrics = linksMetrics[key]
      if (!metrics) {
        map.set(key, new THREE.Group())
        return
      }

      const group = new THREE.Group()
      const tableTexture = createLinksTableTexture(metrics)
      const tableMat = new THREE.MeshStandardMaterial({
        map: tableTexture,
        transparent: true,
        opacity: 1
      })
      const tableMesh = new THREE.Mesh(new THREE.BoxGeometry(60, 30, 2), [
        new THREE.MeshStandardMaterial({ color: '#111' }),
        new THREE.MeshStandardMaterial({ color: '#111' }),
        new THREE.MeshStandardMaterial({ color: '#111' }),
        new THREE.MeshStandardMaterial({ color: '#111' }),
        tableMat,
        new THREE.MeshStandardMaterial({ color: '#222' })
      ])
      tableMesh.position.set(0, 25, 0)
      tableMesh.onBeforeRender = (_, __, camera) => {
        tableMesh.lookAt(camera.position)
      }
      tableMesh.visible = false
      group.add(tableMesh)

      linkTablesRef.current[key] = tableMesh
      map.set(key, group)
    })

    return map
  }, [data])

  function genRandomTree(N = 300, reverse = false) {
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          [reverse ? 'target' : 'source']: id,
          [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
        }))
    }
  }

  return (
    <ForceGraphVR
      ref={fgRef}
      graphData={{
        nodes: [
          {
            id: '1'
          }
        ],
        links: data.links
      }}
      backgroundColor='#00000000'
      nodeThreeObject={(n: GraphNode) => nodeObjects.get(n.id)!}
      nodeLabel={(node: GraphNode) => {
        if (node.type === 'switch') return getSwitchDataTooltipHTML(node)
        if (node.type === 'port') return getPortDataTooltipHTML(node)
        return ''
      }}
      // linkThreeObjectExtend
      // linkThreeObject={(l: GraphLink) =>
      //   linkObjects.get(`${l.source}-${l.target}`) ?? new THREE.Group()
      // }
      // linkPositionUpdate={(obj, { start, end }) => {
      //   const mid = {
      //     x: (start.x + end.x) / 2,
      //     y: (start.y + end.y) / 2,
      //     z: (start.z + end.z) / 2
      //   }
      //   obj.position.set(mid.x, mid.y + 10, mid.z)
      // }}
      // linkColor={(l: GraphLink) =>
      //   l.internal ? 'gray' : envs.styles.linkColor
      // }
      // linkOpacity={0.5}
      // linkWidth={(l: GraphLink) => (l.internal ? 0.8 : 3)}
      // linkDirectionalParticles={(l: GraphLink) => (l.internal ? 3 : 6)}
      // linkDirectionalParticleSpeed={0.004}
      // linkDirectionalParticleWidth={1.2}
      onNodeClick={(node: GraphNode) => {
        if (node.type !== 'switch') return
        setSelectedLinkId(null) // aquí sí puedes apagar links
        setSelectedNodeId(node.id)
      }}
      onLinkClick={(link) => {
        const srcId =
          typeof link.source === 'object'
            ? (link.source as GraphNode).id
            : (link.source as string)
        const tgtId =
          typeof link.target === 'object'
            ? (link.target as GraphNode).id
            : (link.target as string)

        setSelectedLinkId(`${srcId}-${tgtId}`)
        setSelectedNodeId(null)
      }}
    />
  )
}
