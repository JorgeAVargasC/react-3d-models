import { envs } from '../config/envs'
import { linksAdapter } from './adapters/links-adapter'
import axiosInstance from './axios/axios-instance'
import linksData from './data/links.json'
import switchesData from './data/switches.json'

import type { ILink } from './types/link'
import type { ISwitch } from './types/switch'

export type IApi = {
  getLinks: () => Promise<ILink[]>
  getSwitches: () => Promise<ISwitch[]>
}

const dummyApi: IApi = {
  getLinks: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(linksAdapter(linksData))
      }, 1000)
    })
  },
  getSwitches: async () => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(switchesData)
      }, 1000)
    })
  }
}

const prodApi: IApi = {
  getLinks: async () => {
    const res = await axiosInstance.get<ILink[][]>('/links')
    return linksAdapter(res.data)
  },
  getSwitches: async () => {
    const res = await axiosInstance.get<ISwitch[]>('/switches')
    return res.data
  }
}

const api: IApi = envs.apiMode === 'prod' ? prodApi : dummyApi

export default api
