import type { ILink } from '../types/link'
import type { ILinkDTO } from '../types/link.dto'

const parseSwitch = (name: string): number => {
  const num = Number(name.replace(/^S/i, ''))
  return num
}

export const linksAdapter = (links: ILink[][]): ILinkDTO[] => {
  return links
    .flat()
    .map((link) => {
      const sourceSwitch = parseSwitch(link.relationship.Origen)
      const targetSwitch = parseSwitch(link.relationship.Destino)

      const sourcePort = link.relationship.OrigenPuerto?.low ?? 0
      const targetPort = link.relationship.DestinoPuerto?.low ?? 0

      return {
        sourceSwitch,
        sourcePort,
        targetSwitch,
        targetPort
      }
    })
    .filter(
      (link) =>
        !isNaN(link.sourceSwitch) &&
        !isNaN(link.targetSwitch) &&
        link.sourceSwitch !== link.targetSwitch
    )
}
