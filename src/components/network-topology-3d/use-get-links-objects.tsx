import type { GraphLink, GraphNode } from '@/api/types/graph-types'
import { useMemo } from 'react'
import * as THREE from 'three'
import { createLinksTableTexture } from './create-links-table-texture'
import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'

interface Props {
  graphData: {
    nodes: GraphNode[]
    links: GraphLink[]
  }
  linksMetrics: Record<string, ILinkMetricsDTO | undefined>
}

export const useGetLinksObjects = ({ graphData, linksMetrics }: Props) => {
  const linkObjects = useMemo(() => {
    const map = new Map<string, THREE.Object3D>()

    graphData.links.forEach((link) => {
      const key = `${link.source}-${link.target}`
      const linksGroup = new THREE.Group()

      if (link.internal) return

      const metrics = linksMetrics[key]

      if (!metrics) return

      const tableTexture = createLinksTableTexture(metrics)

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
      linksGroup.add(tableMesh)

      map.set(key, linksGroup)
    })

    return map
  }, [graphData, linksMetrics])

  return linkObjects
}
