import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

export const useGetLinkMetrics = (
  sourceSwitch: number,
  targetSwitch: number
) => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.getLinkMetrics(sourceSwitch, targetSwitch)
  })
}
