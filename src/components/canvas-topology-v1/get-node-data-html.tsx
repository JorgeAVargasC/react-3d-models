import type { PortNode } from '@/api/types/graph-types'

export const getPortDataTooltipHTML = (portData: PortNode): string => {
  const getPortStatus = (isActive: boolean) => {
    return `
      <span class="px-2 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
          : 'bg-red-500/20 text-red-400 border border-red-500/40'
      }">
        ${isActive ? 'UP' : 'DOWN'}
      </span>`
  }

  return `
    <div class="min-w-[280px] max-w-sm rounded-2xl bg-card/70 backdrop-blur-md border border-slate-700/60 text-white shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r bg-slate-950/90 px-4 py-2 flex items-center justify-between">
        <h2 class="font-semibold text-lg tracking-wide">${portData.label}</h2>
        <div class="flex items-center gap-2">
          ${getPortStatus(portData.isActive)}
        </div>
      </div>

      <!-- Body -->
      <div class="px-4 pt-3 pb-4 text-sm font-sans bg-slate-950/80 space-y-2">
        <div class="flex justify-between">
          <span class="text-slate-400 text-xs">Parent Switch</span>
          <span class="font-medium">${portData.parentSwitchId}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400 text-xs">DPID</span>
          <span class="font-mono text-slate-300">${portData.dpid}</span>
        </div>
        
      </div>
    </div>
  `
}
