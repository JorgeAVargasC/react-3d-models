import type { ILink } from '../types/link'

export const linksAdapter = (links: ILink[][]): ILink[] => {
  return links.flat()
}
