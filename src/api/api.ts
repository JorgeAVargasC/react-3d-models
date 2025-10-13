import { delay } from '@/helpers/delay'
import { envs, type IEnvs } from '../config/envs'
import { linksAdapter } from './adapters/links.adapter'
import { switchesAdapter } from './adapters/switches.adapter'
import axiosInstance from './axios/axios-instance'
import type { ILink } from './types/link'
import type { ILinkDTO } from './types/link.dto'
import type { ISwitch } from './types/switch'
import type { ISwitchDTO } from './types/switch.dto'
import type { ILinkMetricsDTO } from './types/link-metrics.dto'
import { linkMetricsAdapter } from './adapters/link-metrics.adapter'
import type { ILinkMetrics } from './types/link-metrics'
import { logger } from '@/helpers/logger'
import { COLORS } from '@/constants/colors'

// mock data
import linksData from './data/links.json'
import switchesData from './data/switches.json'
import linkMetricsData from './data/link-metrics.json'

export type IApi = {
  getLinks: () => Promise<ILinkDTO[]>
  getSwitches: () => Promise<ISwitchDTO[]>
  getLinkMetrics: (
    sourceSwitch: number,
    targetSwitch: number
  ) => Promise<ILinkMetricsDTO>
}

const awaitDelay = delay(200)

const devApi: IApi = {
  getLinks: async () => {
    await awaitDelay
    const linksAdapted = linksAdapter(linksData)
    logger('[api][dev] getLinks - RAW DATA', COLORS.GREEN)
    console.log(linksData)

    logger('[api][dev] getLinks - ADAPTED', COLORS.GREEN)
    console.log(linksAdapted)

    return linksAdapted
  },
  getSwitches: async () => {
    await awaitDelay

    const switchesAdapted = switchesAdapter(switchesData)

    logger('[api][dev] getSwitches - RAW DATA', COLORS.SKY)
    console.log(switchesData)

    logger('[api][dev] getSwitches - ADAPTED', COLORS.SKY)
    console.log(switchesAdapted)

    return switchesAdapted
  },
  getLinkMetrics: async (_source, _target) => {
    await awaitDelay

    const linksMetricsAdapted = linkMetricsAdapter(linkMetricsData)

    logger('[api][dev] getLinkMetrics - RAW DATA', COLORS.ORANGE)
    console.log(linkMetricsData)

    logger('[api][dev] getLinkMetrics - ADAPTED', COLORS.ORANGE)
    console.log(linksMetricsAdapted)

    return linksMetricsAdapted
  }
}

const prodApi: IApi = {
  getLinks: async () => {
    const res = await axiosInstance.get<ILink[][]>('links')
    const linksAdapted = linksAdapter(res.data)

    logger('[api][prod] getLinks - RAW DATA', COLORS.GREEN)
    console.log(res.data)

    logger('[api][prod] getLinks - ADAPTED', COLORS.GREEN)
    console.log(linksAdapted)

    return linksAdapted
  },
  getSwitches: async () => {
    const res = await axiosInstance.get<ISwitch[]>('switches')
    const switchesAdapted = switchesAdapter(res.data)

    logger('[api][prod] getSwitches - RAW DATA', COLORS.SKY)
    console.log(res.data)

    logger('[api][prod] getSwitches - ADAPTED', COLORS.SKY)
    console.log(switchesAdapted)

    return switchesAdapted
  },
  getLinkMetrics: async (origen, destino) => {
    const res = await axiosInstance.get<ILinkMetrics>(
      `metrics?origen=${origen}&destino=${destino}`
    )

    const linksMetricsAdapted = linkMetricsAdapter(res.data)

    logger('[api][prod] getLinkMetrics - RAW DATA', COLORS.ORANGE)
    console.log(res.data)

    logger('[api][prod] getLinkMetrics - ADAPTED', COLORS.ORANGE)
    console.log(linksMetricsAdapted)

    return linksMetricsAdapted
  }
}

const apis: Record<IEnvs['apiMode'], IApi> = {
  dev: devApi,
  prod: prodApi
}

const api: IApi = apis[envs.apiMode]

export default api
