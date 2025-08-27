import { useGetLinks } from '../hooks/use-get-links'
import { useGetSwitches } from '../hooks/use-get-switches'

export const MainPage = () => {
  const linksQuery = useGetLinks()
  const switchesQuery = useGetSwitches()

  return (
    <div className='dark bg-background text-foreground grid grid-cols-2'>
      <code>
        <pre>{JSON.stringify(linksQuery.data, null, 2)}</pre>
      </code>

      <code>
        <pre>{JSON.stringify(switchesQuery.data, null, 2)}</pre>
      </code>
    </div>
  )
}
