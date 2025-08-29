export type ISwitchDTO = {
  name: string

  switchPort: {
    low: number
    high: number
  }

  ports: {
    label: string
    isActive: boolean
    dpid: string
    low: number
    high: number
  }[]
}
