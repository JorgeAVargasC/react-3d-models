import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'
import { envs } from '@/config/envs'
import { createTableTexture } from '@/lib/create-canvas-table-texture'

export const createLinksTableTexture = (link: ILinkMetricsDTO) => {
  const texture = createTableTexture(
    `LINK S${link.source} → S${link.target}`,
    ['Metric', 'Value'],
    [
      // [
      //   'Lost',
      //   { text: `${link.lost.toFixed(2)} %`, color: envs.styles.errorColor }
      // ],
      [
        'Delay',
        { text: `${link.delay.toFixed(2)} ms`, color: envs.styles.warningColor }
      ],
      [
        'Throughput',
        {
          text: `${link.throughput.toFixed(2)} kbps`,
          color: envs.styles.successColor
        }
      ]
    ],
    {
      headerColor: envs.styles.linkColor
    }
  )

  return texture
}
