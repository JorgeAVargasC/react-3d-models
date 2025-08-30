import type { ILinkMetrics } from '../types/link-metrics'
import type { ILinkMetricsDTO } from '../types/link-metrics.dto'

export const linkMetricsAdapter = (linkMetrics: ILinkMetrics): ILinkMetricsDTO => {
  return {
    source: Number(linkMetrics.origen),
    target: Number(linkMetrics.destino),
    lost: Number(linkMetrics.perdidas),
    delay: Number(linkMetrics.delay),
    throughput: Number(linkMetrics.throughput)
  }
}
