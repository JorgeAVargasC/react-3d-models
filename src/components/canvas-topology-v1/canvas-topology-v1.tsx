import * as THREE from 'three'
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d'
import { useEffect, useRef, useState } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { ISwitchDTO } from '@/api/types/switch.dto'
import type { ILinkDTO } from '@/api/types/link.dto'

import SpriteText from 'three-spritetext'
import { getSwitchDataHTML } from './get-switch-data-html'

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

      const controls = (fgRef.current as any).controls as OrbitControls
      if (controls) {
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.enablePan = true
        controls.enableZoom = true

        controls.minPolarAngle = Math.PI / 4
        controls.maxPolarAngle = (3 * Math.PI) / 4

        controls.minDistance = 50
        controls.maxDistance = 500
      }
    }
  }, [])

  const data = {
    nodes: switches,
    links: links
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
      nodeThreeObject={(node) => {
        const group = new THREE.Group()

        if (custom3dObj) {
          const obj = custom3dObj.clone(true)
          group.add(obj)
        } else {
          group.add(
            new THREE.Mesh(
              new THREE.BoxGeometry(5, 5, 5),
              new THREE.MeshStandardMaterial({ color: 'gray' })
            )
          )
        }

        const myNode = node as ISwitchDTO

        const label = new SpriteText(myNode.name, 5)
        label.color = 'green'
        label.position.set(0, 15, 0)
        group.add(label)

        return group
      }}
      nodeLabel={(node) => {
        const switchData = node as ISwitchDTO
        return getSwitchDataHTML(switchData)
      }}
      linkColor={() => 'rgb(14, 230, 43)'}
      linkOpacity={0.2}
      linkWidth={0.6}
      linkDirectionalParticles={1}
      linkDirectionalParticleSpeed={0.003}
      linkDirectionalParticleWidth={1.5}
      backgroundColor='#00000000'
    />
  )
}
