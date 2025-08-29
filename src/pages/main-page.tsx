import { CanvasTopologyV1 } from '@/components/canvas-topology-v1/canvas-topology-v1'
import { useGetLinks } from '../hooks/use-get-links'
import { useGetSwitches } from '../hooks/use-get-switches'

export const MainPage = () => {
  const linksQuery = useGetLinks()
  const switchesQuery = useGetSwitches()

  const isFetching = linksQuery.isFetching || switchesQuery.isFetching

  return (
    <div className='min-h-dvh min-w-dvw dark overflow-hidden bg-background text-foreground max-h-dvh max-w-dvw'>
      {isFetching && (
        <div className='fixed inset-0 z-20 flex items-center justify-center bg-blue/30 backdrop-blur-sm'>
          <div className='h-16 w-16 animate-spin rounded-full border-8 border-gray-200 border-t-sky-600'></div>
        </div>
      )}

      {!isFetching && linksQuery.data && switchesQuery.data && (
        <CanvasTopologyV1
          switches={switchesQuery.data || []}
          links={linksQuery.data || []}
        />
      )}
    </div>
  )
}
