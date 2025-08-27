import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

export const useGetSwitches = () => {
  return useQuery({
    queryKey: ['switches'],
    queryFn: api.getSwitches
  })
}
