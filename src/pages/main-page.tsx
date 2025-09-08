import { useGetLinks } from '../hooks/use-get-links'
import { useGetSwitches } from '../hooks/use-get-switches'
import { useGetAllLinksMetrics } from '@/hooks/use-get-all-links-metrics'
import { NetworkTopology3D } from '@/components/network-topology-3d/network-topology-3d'
import { useMemo } from 'react'
import { useGetNodeObjects } from '@/components/network-topology-3d/use-get-node-objects'
import { useGetLinksObjects } from '@/components/network-topology-3d/use-get-links-objects'
import { buildGraphData } from '@/components/network-topology-3d/build-graph'

export const MainPage = () => {
  const linksQuery = useGetLinks()
  const switchesQuery = useGetSwitches()

  const linksMetricsQuery = useGetAllLinksMetrics(linksQuery.data || [])

  const switchesData = switchesQuery.data ?? []
  const linksData = linksQuery.data ?? []
  const linksMetrics = linksMetricsQuery.data ?? {}

  const isFetching =
    linksQuery.isFetching ||
    switchesQuery.isFetching ||
    linksMetricsQuery.isFetching

  const graphData = useMemo(
    () => buildGraphData(switchesData, linksData),
    [switchesData, linksData]
  )

  const thereIsGraphData =
    graphData.nodes.length > 0 && graphData.links.length > 0

  const nodeObjects = useGetNodeObjects({ graphData })

  const thereIsNodeObjects = nodeObjects.size > 0

  const linkObjects = useGetLinksObjects({
    graphData,
    linksMetrics
  })

  const thereIsLinkObjects = linkObjects.size > 0

  return (
    <div className='min-h-dvh min-w-dvw dark overflow-hidden bg-background text-foreground max-h-dvh max-w-dvw'>
      {isFetching && (
        <div className='fixed inset-0 z-20 flex items-center justify-center bg-blue/30 backdrop-blur-sm'>
          <div className='h-16 w-16 animate-spin rounded-full border-8 border-gray-200 border-t-sky-600'></div>
        </div>
      )}

      {!isFetching &&
        thereIsGraphData &&
        thereIsNodeObjects &&
        thereIsLinkObjects && (
          <NetworkTopology3D
            graphData={graphData}
            nodeObjects={nodeObjects}
            linkObjects={linkObjects}
          />
        )}
    </div>
  )
}
