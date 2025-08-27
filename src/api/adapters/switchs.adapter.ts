import type { ISwitch } from '../types/switch'
import type { ISwitchDTO } from '../types/switch.dto'

export const switchesAdapter = (switches: ISwitch[]): ISwitchDTO[] => {
  return switches.map((sw) => ({
    id: sw.switches.switch_dpid.low,
    group: 1,
    val: Object.keys(sw.switches).filter((k) => k.includes('puerto')).length
  }))
}
