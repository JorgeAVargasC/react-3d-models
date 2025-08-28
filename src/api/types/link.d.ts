export interface ILink {
  relationship: LinkData
}

interface LinkData {
  Destino: string
  Origen: string
  OrigenPuerto: PortNumber
  DestinoPuerto: PortNumber
}

interface PortNumber {
  low: number
  high: number
}
