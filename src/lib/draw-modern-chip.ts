import { roundRect } from './canvas-round-rect'

export function drawModernChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) {
  ctx.font = '500 13px system-ui, -apple-system, sans-serif'
  const textWidth = ctx.measureText(text).width
  const padding = 14
  const height = 30
  const width = textWidth + padding * 2

  ctx.fillStyle = `${color}20`
  roundRect(ctx, x, y, width, height, 12)
  ctx.fill()

  ctx.strokeStyle = `${color}40`
  ctx.lineWidth = 1
  roundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, 12)
  ctx.stroke()

  ctx.fillStyle = color
  ctx.fillText(text, x + padding, y + 20)
}
