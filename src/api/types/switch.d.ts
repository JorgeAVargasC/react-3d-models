export interface ISwitch {
  switches: Switches
}

export interface Switches {
  puerto3_numero: PuertoNumero
  puerto2_dpid: string
  port0_status: Port0Status
  port3_status: PortStatus
  port1_status: PortStatus
  port2_status: PortStatus
  puerto0_numero: PuertoNumero
  puerto1_dpid: string
  switch_dpid: PuertoNumero
  puerto2_numero: PuertoNumero
  puerto1_numero: PuertoNumero
  puerto0_dpid: string
  puerto3_dpid: string
  puerto4_numero?: PuertoNumero
  puerto4_dpid?: string
  port4_status?: PortStatus
  puerto5_numero?: PuertoNumero
  port5_status?: PortStatus
  puerto5_dpid?: string
}

export type PortStatus = string

export interface PuertoNumero {
  low: number
  high: number
}
