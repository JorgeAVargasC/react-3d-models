import type { GraphLink, GraphNode } from '@/api/types/graph-types'
import { useMemo } from 'react'
import * as THREE from 'three'
import { createSwitchTableTexture } from './create-switch-table-texture'
import { envs } from '@/config/envs'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface Props {
  graphData: {
    nodes: GraphNode[]
    links: GraphLink[]
  }
}

export const useGetNodeObjects = ({ graphData }: Props) => {
  // const loader = new GLTFLoader()

  const nodeObjects = useMemo(() => {
    const map = new Map<string, any>()

    graphData.nodes.forEach((node) => {
      if (node.type === 'switch') {
        const wrapper = new THREE.Group()

        // loader.load(
        //   '/3d/router/source/lyq.glb',
        //   (gltf) => {
        //     const obj = gltf.scene
        //     obj.scale.set(0.5, 0.5, 0.5)
        //     wrapper.add(obj)
        //   },
        //   (xhr) => {
        //     console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`) // progreso opcional
        //   },
        //   (error) => {
        //     console.error('Error al cargar GLB:', error)
        //   }
        // )

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(30, 3, 10),
          new THREE.MeshStandardMaterial({
            color: node.id === 'root' ? '#FFFFFF' : envs.styles.switchColor
          })
        )
        wrapper.add(cube)

        const tableTexture = createSwitchTableTexture(node)
        const tableMat = new THREE.MeshStandardMaterial({
          map: tableTexture,
          transparent: true
        })
        const tableMesh = new THREE.Mesh(new THREE.BoxGeometry(60, 30, 2), [
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#111' }),
          new THREE.MeshStandardMaterial({ color: '#111' }),
          tableMat,
          tableMat
        ])
        tableMesh.position.set(0, 30, 0)

        wrapper.add(tableMesh)
        map.set(node.id, wrapper)
        return
      }

      if (node.type === 'port') {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(3, 16, 16),
          new THREE.MeshStandardMaterial({
            color: node.isActive
              ? envs.styles.successColor
              : envs.styles.errorColor
          })
        )
        map.set(node.id, sphere)
      }
    })

    return map
  }, [graphData])

  return nodeObjects
}
