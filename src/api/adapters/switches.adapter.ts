import type { ISwitch } from '../types/switch'
import type { ISwitchDTO } from '../types/switch.dto'

export const switchesAdapter = (switches: ISwitch[]): ISwitchDTO[] => {
  return switches.map((sw) => {
    const s = sw.switches

    const ports = Array.from({ length: 6 }, (_, i) => {
      const isActive = (s as any)[`port${i}_status`]
      const dpid = (s as any)[`puerto${i}_dpid`]
      const low = (s as any)[`puerto${i}_numero`]?.low

      if (isActive || dpid || low !== undefined) {
        return {
          label: `Port ${i}`,
          isActive: isActive === 'UP',
          dpid: dpid ?? '',
          number: low
        }
      }
      return null
    }).filter(Boolean) as ISwitchDTO['ports']

    return {
      switchId: s.switch_dpid.low,
      name: `s${s.switch_dpid.low}`,
      ports,
      switchPort: s.switch_dpid.low
    }
  })
}
