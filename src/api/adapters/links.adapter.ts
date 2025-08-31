import type { ILink } from '../types/link'
import type { ILinkDTO } from '../types/link.dto'

const parseSwitch = (name: string): number => {
  const num = Number(name.replace(/^S/i, ''))
  return num
}

export const linksAdapter = (links: ILink[][]): ILinkDTO[] => {
  return links.flat().map((link) => {
    const sourceSwitch = parseSwitch(link.relationship.Origen)
    const targetSwitch = parseSwitch(link.relationship.Destino)

    const sourcePort = link.relationship.OrigenPuerto.low
    const targetPort = link.relationship.DestinoPuerto.low

    return {
      sourceSwitch,
      sourcePort,
      targetSwitch,
      targetPort
    }
  })
}
