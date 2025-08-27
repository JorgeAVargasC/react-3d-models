import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

export const useGetLinks = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: api.getLinks
  })
}
