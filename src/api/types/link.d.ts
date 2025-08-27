export interface ILink {
  relationship: IRelationship
}

export interface IRelationship {
  Destino: string
  Origen: string
  OrigenPuerto: IPuerto
  DestinoPuerto: IPuerto
}

export interface IPuerto {
  low: number
  high: number
}
