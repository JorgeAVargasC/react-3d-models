import * as THREE from 'three'
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d'
import { useEffect, useRef, useState } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { ISwitchDTO } from '@/api/types/switch.dto'
import type { ILinkDTO } from '@/api/types/link.dto'

interface Props {
  switches: ISwitchDTO[]
  links: ILinkDTO[]
}

export const CanvasTopologyV1 = ({ switches, links }: Props) => {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined)

  const [custom3dObj, setCustom3dObj] = useState<THREE.Object3D | null>(null)

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge')?.strength(-80)

      // 👇 acceder al OrbitControls
      const controls = (fgRef.current as any).controls as OrbitControls
      if (controls) {
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.enablePan = true
        controls.enableZoom = true

        // 🎮 evita rotaciones "raras" (ej: quedar viendo al revés)
        controls.minPolarAngle = Math.PI / 4 // límite inferior (45°)
        controls.maxPolarAngle = (3 * Math.PI) / 4 // límite superior (135°)

        // puedes controlar la distancia mínima/máxima
        controls.minDistance = 50
        controls.maxDistance = 500
      }
    }
  }, [])

  const data = {
    nodes: switches.map((s) => ({ ...s, id: s.id })),
    links: links.map((l) => ({ ...l, source: l.source, target: l.target }))
  }

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/3d/router/source/lyq.glb', (gltf) => {
      const object = gltf.scene
      object.scale.set(0.5, 0.5, 0.5)
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
      nodeThreeObject={() => {
        if (custom3dObj) return custom3dObj.clone(true)
        return new THREE.Mesh(
          new THREE.BoxGeometry(5, 5, 5),
          new THREE.MeshStandardMaterial({ color: 'gray' })
        )
      }}
      linkColor={() => 'rgba(230, 255, 208, 0.3)'}
      linkOpacity={0.5}
      linkWidth={0.5}
      linkDirectionalParticles={1}
      linkDirectionalParticleSpeed={0.003}
      linkDirectionalParticleWidth={1}
      backgroundColor='#00000000'
    />
  )
}
