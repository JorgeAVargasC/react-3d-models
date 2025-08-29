export interface ILink {
  relationship: {
    Destino: string
    Origen: string
    OrigenPuerto: PortNumber
    DestinoPuerto: PortNumber
  }
}

interface PortNumber {
  low: number
  high: number
}
