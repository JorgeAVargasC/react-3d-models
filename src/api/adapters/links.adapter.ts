import type { ILink } from '../types/link'
import type { ILinkDTO } from '../types/link.dto'

const parseSwitch = (name: string): { low: number; high: number } => {
  const num = Number(name.replace(/^S/i, ''))
  return { low: num, high: 0 } // TODO, seria mejor tener low y high de los switches en lugar de "S1", "S4", etc
}

export const linksAdapter = (links: ILink[][]): ILinkDTO[] => {
  return links.flat().map((link) => {
    const source = parseSwitch(link.relationship.Origen)
    const target = parseSwitch(link.relationship.Destino)

    return {
      sourceSwitch: source,
      sourcePort: {
        low: link.relationship.OrigenPuerto.low,
        high: link.relationship.OrigenPuerto.high
      },
      targetSwitch: target,
      targetPort: {
        low: link.relationship.DestinoPuerto.low,
        high: link.relationship.DestinoPuerto.high
      }
    }
  })
}
