export type ISwitchDTO = {
  id: number

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
