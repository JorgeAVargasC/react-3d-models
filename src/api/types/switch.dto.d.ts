export type ISwitchDTO = {
  switchId: number

  name: string

  ports: {
    label: string
    isActive: boolean
    dpid: string
    number: number
  }[]
}
