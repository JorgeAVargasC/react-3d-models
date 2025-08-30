import * as THREE from 'three'
import type { SwitchNode } from '@/api/types/graph-types'

export function createTableTexture(sw: SwitchNode): THREE.Texture {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = 700
  canvas.height = 300

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
  ctx.fillText(sw.name, 24, 32)

  // Low / High pills
  drawPill(ctx, `LOW: ${sw.switchPort.low}`, canvas.width - 190, 12, '#94a3b8')
  drawPill(ctx, `HIGH: ${sw.switchPort.high}`, canvas.width - 95, 12, '#94a3b8')

  // ========== Table headers ==========
  const headers = ['PORT', 'STATUS', 'DPID', 'LOW', 'HIGH']
  ctx.font = 'bold 13px sans-serif'
  ctx.fillStyle = '#94a3b8'
  headers.forEach((h, i) => {
    ctx.fillText(h, 30 + i * 125, 75)
  })

  ctx.strokeStyle = 'rgba(51,65,85,0.7)'
  ctx.beginPath()
  ctx.moveTo(20, 85)
  ctx.lineTo(canvas.width - 20, 85)
  ctx.stroke()

  // ========== Rows ==========
  sw.ports.forEach((p, idx) => {
    const y = 115 + idx * 32

    // zebra background
    if (idx % 2 === 1) {
      ctx.fillStyle = 'rgba(15,23,42,0.3)'
      ctx.fillRect(15, y - 22, canvas.width - 30, 30)
    }

    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText(p.label, 30, y)

    // status pill
    drawPill(
      ctx,
      p.isActive ? 'UP' : 'DOWN',
      150,
      y - 18,
      p.isActive ? '#22c55e' : '#ef4444'
    )

    ctx.fillStyle = '#e2e8f0'
    ctx.fillText(p.dpid, 250, y)
    ctx.fillText(String(p.low), 380, y)
    ctx.fillText(String(p.high), 500, y)

    // row separator
    ctx.strokeStyle = 'rgba(51,65,85,0.4)'
    ctx.beginPath()
    ctx.moveTo(20, y + 8)
    ctx.lineTo(canvas.width - 20, y + 8)
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

function drawPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) {
  ctx.font = '13px sans-serif'
  const textWidth = ctx.measureText(text).width
  const padding = 8
  const height = 20
  const width = textWidth + padding * 2

  ctx.fillStyle = color + '33'
  roundRect(ctx, x, y, width, height, 10)
  ctx.fill()

  ctx.strokeStyle = color + '66'
  ctx.lineWidth = 1
  roundRect(ctx, x, y, width, height, 10)
  ctx.stroke()

  ctx.fillStyle = 'white'
  ctx.fillText(text, x + padding, y + 15)
}
