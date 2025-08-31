import { delay } from '@/helpers/delay'
import { envs, type IEnvs } from '../config/envs'
import { linksAdapter } from './adapters/links.adapter'
import { switchesAdapter } from './adapters/switches.adapter'
import axiosInstance from './axios/axios-instance'
import linksData from './data/links.json'
import switchesData from './data/switches.json'
import linkMetricsData from './data/link-metrics.json'

import type { ILink } from './types/link'
import type { ILinkDTO } from './types/link.dto'
import type { ISwitch } from './types/switch'
import type { ISwitchDTO } from './types/switch.dto'
import type { ILinkMetricsDTO } from './types/link-metrics.dto'
import { linkMetricsAdapter } from './adapters/link-metrics.adapter'
import type { ILinkMetrics } from './types/link-metrics'

export type IApi = {
  getLinks: () => Promise<ILinkDTO[]>
  getSwitches: () => Promise<ISwitchDTO[]>
  getLinkMetrics: (source: number, target: number) => Promise<ILinkMetricsDTO>
}

const awaitDelay = delay(200)

const devApi: IApi = {
  getLinks: async () => {
    await awaitDelay
    return linksAdapter(linksData)
  },
  getSwitches: async () => {
    await awaitDelay
    return switchesAdapter(switchesData)
  },
  getLinkMetrics: async (_source, _target) => {
    await awaitDelay
    return linkMetricsAdapter(linkMetricsData)
  }
}

const prodApi: IApi = {
  getLinks: async () => {
    const res = await axiosInstance.get<ILink[][]>('links')
    return linksAdapter(res.data)
  },
  getSwitches: async () => {
    const res = await axiosInstance.get<ISwitch[]>('switches')
    return switchesAdapter(res.data)
  },
  getLinkMetrics: async (origen, destino) => {
    const res = await axiosInstance.get<ILinkMetrics>(
      `metrics?origen=${origen}&destino=${destino}`
    )
    return linkMetricsAdapter(res.data)
  }
}

const apis: Record<IEnvs['apiMode'], IApi> = {
  dev: devApi,
  prod: prodApi
}

const api: IApi = apis[envs.apiMode]

export default api
