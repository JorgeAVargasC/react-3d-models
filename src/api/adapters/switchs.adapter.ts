import type { ISwitch } from '../types/switch'
import type { ISwitchDTO } from '../types/switch.dto'

export const switchesAdapter = (switches: ISwitch[]): ISwitchDTO[] => {
  return switches.map((sw) => {
    const s = sw.switches

    const ports = Array.from({ length: 6 }, (_, i) => {
      const isActive = (s as any)[`port${i}_status`]
      const dpid = (s as any)[`puerto${i}_dpid`]
      const low = (s as any)[`puerto${i}_numero`]?.low
      const high = (s as any)[`puerto${i}_numero`]?.high

      if (isActive || dpid || low !== undefined || high !== undefined) {
        return {
          label: `Port ${i}`,
          isActive: isActive === 'UP',
          dpid: dpid ?? '',
          low: low ?? 0,
          high: high ?? 0
        }
      }
      return null
    }).filter(Boolean) as ISwitchDTO['ports']

    return {
      id: s.switch_dpid.low,
      name: s.puerto0_dpid,
      ports,
      switchPort: {
        low: s.switch_dpid.low,
        high: s.switch_dpid.high
      }
    }
  })
}
