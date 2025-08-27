import { delay } from '@/helpers/delay'
import { envs, type IEnvs } from '../config/envs'
import { linksAdapter } from './adapters/links.adapter'
import { switchesAdapter } from './adapters/switchs.adapter'
import axiosInstance from './axios/axios-instance'
import linksData from './data/links.json'
import switchesData from './data/switches.json'

import type { ILink } from './types/link'
import type { ILinkDTO } from './types/link.dto'
import type { ISwitch } from './types/switch'
import type { ISwitchDTO } from './types/switch.dto'

export type IApi = {
  getLinks: () => Promise<ILinkDTO[]>
  getSwitches: () => Promise<ISwitchDTO[]>
}

const awaitDelay = delay(2000)

const devApi: IApi = {
  getLinks: async () => {
    await awaitDelay
    return linksAdapter(linksData)
  },
  getSwitches: async () => {
    await awaitDelay
    return switchesAdapter(switchesData)
  }
}

const prodApi: IApi = {
  getLinks: async () => {
    const res = await axiosInstance.get<ILink[][]>('/links')
    return linksAdapter(res.data)
  },
  getSwitches: async () => {
    const res = await axiosInstance.get<ISwitch[]>('/switches')
    return switchesAdapter(res.data)
  }
}

const apis: Record<IEnvs['apiMode'], IApi> = {
  dev: devApi,
  prod: prodApi
}

const api: IApi = apis[envs.apiMode]

export default api
