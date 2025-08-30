import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'

export const getLinkMetricsHTML = (
  metrics: ILinkMetricsDTO
): HTMLDivElement => {
  const div = document.createElement('div')
  div.className =
    'min-w-[220px] rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white shadow-lg overflow-hidden text-xs font-sans'

  div.innerHTML = `
    <div class="bg-gradient-to-r from-slate-950/90 to-slate-800/80 px-3 py-1.5 flex items-center justify-between">
      <h3 class="font-semibold text-sm tracking-wide">Link Metrics</h3>
      <span class="text-[10px] text-slate-400">PORT-TO-PORT</span>
    </div>

    <table class="w-full text-left border-collapse text-[11px]">
      <thead>
        <tr class="text-slate-400 border-b border-slate-700/60">
          <th class="p-1">Lost</th>
          <th class="p-1">Delay</th>
          <th class="p-1">Throughput</th>
        </tr>
      </thead>
      <tbody>
        <tr class="odd:bg-slate-800/40 hover:bg-slate-700/40 transition-colors">
          <td class="p-1 text-slate-300">${metrics.lost}</td>
          <td class="p-1 text-slate-300">${metrics.delay}</td>
          <td class="p-1 text-slate-300">${metrics.throughput}</td>
        </tr>
      </tbody>
    </table>
  `
  return div
}
