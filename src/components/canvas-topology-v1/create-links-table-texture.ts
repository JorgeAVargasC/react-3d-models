import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'
import { createTableTexture } from '@/lib/create-canvas-table-texture'

export const createLinksTableTexture = (link: ILinkMetricsDTO) => {
  const texture = createTableTexture(
    `LINK S${link.source} → S${link.target}`,
    ['Metric', 'Value'],
    [
      ['Lost', { text: `${link.lost.toFixed(2)} %`, color: '#f43f5e' }],
      ['Delay', { text: `${link.delay.toFixed(2)} ms`, color: '#eab308' }],
      [
        'Throughput',
        { text: `${link.throughput.toFixed(2)} kbps`, color: '#10b981' }
      ]
    ],
    {
      headerColor: 'green'
    }
  )

  return texture
}
