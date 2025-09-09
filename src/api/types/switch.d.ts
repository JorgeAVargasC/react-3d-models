export interface ISwitch {
  switches: SwitchData
}

export interface SwitchData {
  // status UP or DOWN
  port0_status?: string
  port1_status?: string
  port2_status?: string
  port3_status?: string
  port4_status?: string
  port5_status?: string

  // dpid (Data Path Identifier)
  puerto0_dpid?: string // "s1"
  puerto1_dpid?: string // "s1-eth4"
  puerto2_dpid?: string // "s1-eth1"
  puerto3_dpid?: string // "s1-eth2"
  puerto4_dpid?: string // "s1-eth3"
  puerto5_dpid?: string // "s1-eth5"

  // port number
  switch_dpid: PortNumber
  puerto0_numero?: PortNumber
  puerto1_numero?: PortNumber
  puerto2_numero?: PortNumber
  puerto3_numero?: PortNumber
  puerto5_numero?: PortNumber
  puerto4_numero?: PortNumber
}

export interface PortNumber {
  low: number
  high: number
}

// "switches": {
//       "puerto4_numero": {
//         "low": 3,
//         "high": 0
//       },
//       "puerto3_numero": {
//         "low": 2,
//         "high": 0
//       },
//       "puerto2_dpid": "s1-eth1",
//       "puerto4_dpid": "s1-eth3",
//       "port0_status": "DOWN",
//       "port4_status": "UP",
//       "port3_status": "UP",
//       "port1_status": "UP",
//       "port2_status": "UP",
//       "puerto0_numero": {
//         "low": -2,
//         "high": 0
//       },
//       "puerto1_dpid": "s1-eth4",
//       "switch_dpid": {
//         "low": 1,
//         "high": 0
//       },
//       "puerto2_numero": {
//         "low": 1,
//         "high": 0
//       },
//       "puerto1_numero": {
//         "low": 4,
//         "high": 0
//       },
//       "puerto0_dpid": "s1",
//       "puerto3_dpid": "s1-eth2"
//     }
