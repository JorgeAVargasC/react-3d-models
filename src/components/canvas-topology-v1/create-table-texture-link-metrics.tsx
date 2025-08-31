import * as THREE from 'three'
import type { ILinkMetricsDTO } from '@/api/types/link-metrics.dto'

export function createTableTextureLinkMetrics(
  link: ILinkMetricsDTO
): THREE.Texture {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = 500
  canvas.height = 250

  // ========== Background with rounded borders ==========
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 16)
  ctx.fill()

  // ========== Header ==========
  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)'
  roundRect(ctx, 0, 0, canvas.width, 50, 16)
  ctx.fill()

  ctx.fillStyle = 'white'
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText(`LINK ${link.source} → ${link.target}`, 24, 32)

  // ========== Table headers ==========
  const headers = ['Metric', 'Value']
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = '#94a3b8'
  headers.forEach((h, i) => {
    ctx.fillText(h, 30 + i * 200, 80)
  })

  ctx.strokeStyle = 'rgba(51,65,85,0.7)'
  ctx.beginPath()
  ctx.moveTo(20, 90)
  ctx.lineTo(canvas.width - 20, 90)
  ctx.stroke()

  // ========== Rows ==========
  const rows: [string, string][] = [
    ['Lost (%)', `${link.lost.toFixed(2)} %`],
    ['Delay (ms)', `${link.delay.toFixed(2)} ms`],
    ['Throughput', `${link.throughput.toFixed(2)} Kb/s`]
  ]

  rows.forEach(([label, value], idx) => {
    const y = 120 + idx * 40

    // zebra background
    if (idx % 2 === 1) {
      ctx.fillStyle = 'rgba(15,23,42,0.3)'
      ctx.fillRect(15, y - 22, canvas.width - 30, 36)
    }

    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText(label, 30, y)

    ctx.fillStyle = '#e2e8f0'
    ctx.fillText(value, 230, y)

    // row separator
    ctx.strokeStyle = 'rgba(51,65,85,0.4)'
    ctx.beginPath()
    ctx.moveTo(20, y + 10)
    ctx.lineTo(canvas.width - 20, y + 10)
    ctx.stroke()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// ===== helpers =====
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
