export interface ILink {
  relationship: IRelationship
}

interface IRelationship {
  Destino: string
  Origen: string
  OrigenPuerto: IPuerto
  DestinoPuerto: IPuerto
}

interface IPuerto {
  low: number
  high: number
}
