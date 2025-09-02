import { useGetLinks } from '../hooks/use-get-links'
import { useGetSwitches } from '../hooks/use-get-switches'
import { useGetAllLinksMetrics } from '@/hooks/use-get-all-links-metrics'
import { NetworkTopology3D } from '@/components/network-topology-3d/network-topology-3d'

export const MainPage = () => {
  const linksQuery = useGetLinks()
  const switchesQuery = useGetSwitches()

  const linksMetricsQuery = useGetAllLinksMetrics(linksQuery.data || [])

  const isFetching =
    linksQuery.isFetching ||
    switchesQuery.isFetching ||
    linksMetricsQuery.isFetching

  return (
    <div className='min-h-dvh min-w-dvw dark overflow-hidden bg-background text-foreground max-h-dvh max-w-dvw'>
      {isFetching && (
        <div className='fixed inset-0 z-20 flex items-center justify-center bg-blue/30 backdrop-blur-sm'>
          <div className='h-16 w-16 animate-spin rounded-full border-8 border-gray-200 border-t-sky-600'></div>
        </div>
      )}

      {!isFetching &&
        linksQuery.data &&
        switchesQuery.data &&
        linksMetricsQuery.data && (
          <NetworkTopology3D
            switches={switchesQuery.data || []}
            links={linksQuery.data || []}
            linksMetrics={linksMetricsQuery.data || []}
          />
        )}
    </div>
  )
}
