export type ISwitchDTO = {
  name: string

  switchPort: number

  ports: {
    label: string
    isActive: boolean
    dpid: string
    number: number
  }[]
}
