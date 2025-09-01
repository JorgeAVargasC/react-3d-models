import * as THREE from 'three'
import { drawModernChip } from './draw-modern-chip'
import { roundRect } from './canvas-round-rect'
import { envs } from '@/config/envs'

type TableOptions = {
  width?: number
  padding?: number
  paddingX?: number
  rowHeight?: number
  font?: string
  headerColor?: string
}

type TableRow = (string | { text: string; color?: string })[]

export function createTableTexture(
  title: string,
  columns: string[],
  rows: TableRow[],
  options: TableOptions = {}
): THREE.Texture {
  const {
    width = 550,
    padding = 25,
    paddingX = 12,
    rowHeight = 55,
    font = 'system-ui',
    headerColor = 'transparent'
  } = options

  const headerHeight = 70
  const height = 120 + rows.length * rowHeight
  const dpr = window.devicePixelRatio || 1

  const canvas = document.createElement('canvas')
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  // ==== Background ====
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
  bgGradient.addColorStop(0, envs.styles.tablesBackgroundColor + 'CC')
  bgGradient.addColorStop(1, envs.styles.tablesBackgroundColor + 'CC')
  ctx.fillStyle = bgGradient
  roundRect(ctx, 0, 0, width, height, 0)
  ctx.fill()

  // ==== Header ====
  const headerGradient = ctx.createLinearGradient(0, 0, width, 0)
  headerGradient.addColorStop(0, headerColor + '40')
  headerGradient.addColorStop(1, headerColor + '40')
  ctx.fillStyle = headerGradient
  ctx.fillRect(0, 0, width, headerHeight)

  ctx.fillStyle = '#fff'
  ctx.font = `500 22px ${font}`
  ctx.fillText(title, padding, 44)

  // ==== Column headers ====
  ctx.font = `500 14px ${font}`
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  const colWidth = (width - padding * 2) / columns.length
  columns.forEach((h, i) => {
    ctx.fillText(h, padding + i * colWidth + paddingX, headerHeight + 30)
  })

  // ==== Rows ====
  ctx.font = `400 16px ${font}`
  rows.forEach((row, rIdx) => {
    const y = headerHeight + 60 + rIdx * rowHeight

    if (rIdx % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.005)'
      ctx.fillRect(padding, y - 25, width - padding * 2, rowHeight - 10)
    }

    row.forEach((cell, cIdx) => {
      const x = padding + cIdx * colWidth + paddingX
      if (typeof cell === 'string') {
        ctx.fillStyle = '#fff'
        ctx.fillText(cell, x, y)
      } else {
        drawModernChip(ctx, cell.text, x, y - 20, cell.color ?? '#3b82f6')
      }
    })
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}
