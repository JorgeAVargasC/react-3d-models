import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import type { ILinkDTO } from '@/api/types/link.dto'
import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'

export const useGetAllLinksMetrics = (links: ILinkDTO[]) => {
  return useQuery({
    queryKey: ['metrics', links],
    queryFn: async () => {
      const results: Record<string, ILinkMetricsDTO | undefined> = {}

      const promises = links.map(async (l) => {
        const srcPortId = `${l.sourceSwitch}-${l.sourcePort}`
        const tgtPortId = `${l.targetSwitch}-${l.targetPort}`
        const key = `${srcPortId}-${tgtPortId}`

        try {
          const data = await api.getLinkMetrics(l.sourceSwitch, l.targetSwitch)
          results[key] = data
        } catch (err) {
          console.error(`Error fetching metrics for ${key}`, err)
          results[key] = undefined
        }
      })

      await Promise.allSettled(promises)
      return results
    },
    enabled: links.length > 0
  })
}
