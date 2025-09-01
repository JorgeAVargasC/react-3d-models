import type { SwitchNode } from '@/api/types/graph-types'
import { envs } from '@/config/envs'

export const getSwitchDataTooltipHTML = (switchData: SwitchNode): string => {
  const successColor = envs.styles.successColor
  const errorColor = envs.styles.errorColor

  const getPortStatus = (isActive: boolean) => {
    return `
      <span class="px-2 py-0.5 rounded-full text-xs font-medium" style="background-color: ${isActive ? successColor + '20' : errorColor + '20'}; color: ${isActive ? successColor : errorColor}; border: 1px solid ${isActive ? successColor + '40' : errorColor + '40'}; text-transform: uppercase;">
        ${isActive ? 'UP' : 'DOWN'}
      </span>`
  }

  return `
    <div class="min-w-[330px] max-w-sm rounded-2xl bg-card/70 backdrop-blur-md border border-slate-700/60 text-white shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r bg-slate-950/90 px-4 py-2 flex items-center justify-between">
        <h2 class="font-semibold text-lg tracking-wide">${switchData.name}</h2>
      </div>

      <!-- Table -->
      <div class="px-4 pt-2 pb-4 text-sm font-sans bg-slate-950/80">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/70">
              <th class="p-2">PORT</th>
              <th class="p-2">STATUS</th>
              <th class="p-2">DPID</th>
              <th class="p-2">LOW</th>
            </tr>
          </thead>
          <tbody>
            ${switchData.ports
              .map(
                (p) => `
                <tr class="border-b border-slate-700/40 hover:bg-slate-800/50 transition-colors odd:bg-slate-900/30">
                  <td class="p-2">${p.label}</td>
                  <td class="p-2">
                    ${getPortStatus(p.isActive)}
                  </td>
                  <td class="p-2 text-slate-300">${p.dpid}</td>
                  <td class="p-2 text-slate-300">${p.number}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}
