import type { ILink } from '../types/link'
import type { ILinkDTO } from '../types/link.dto'

const parseSwitchId = (name: string): number => Number(name.replace(/^S/i, ''))

export const linksAdapter = (links: ILink[][]): ILinkDTO[] => {
  return links.flat().map((link) => ({
    source: parseSwitchId(link.relationship.Origen),
    target: parseSwitchId(link.relationship.Destino)
  }))
}
