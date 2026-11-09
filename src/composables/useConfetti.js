/**
 * 離線 Canvas 慶祝彩帶 — 克制版：粒子少、時間短，從答對的圖示位置噴發，不遮擋閱讀
 */
export function useConfetti() {
  let animationId = null

  /**
   * @param {HTMLCanvasElement} canvasEl 覆蓋整個視窗的 canvas
   * @param {{x:number,y:number}} [origin] 噴發點（視窗座標），預設畫面中央
   */
  function startOfflineConfetti(canvasEl, origin) {
    if (!canvasEl) return
    const ctx = canvasEl.getContext('2d')
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight

    const ox = origin?.x ?? canvasEl.width / 2
    const oy = origin?.y ?? canvasEl.height / 2
    const scale = Math.min(canvasEl.width / 1920, canvasEl.height / 1080) || 1
    const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#fde047', '#ec4899', '#6366f1']

    const particles = Array.from({ length: 56 }, () => ({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 18 * scale,
      vy: (-Math.random() * 14 - 6) * scale,
      size: (Math.random() * 8 + 8) * scale,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      alpha: 1
    }))

    if (animationId) cancelAnimationFrame(animationId)

    function render() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      let active = false

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.5 * scale
        p.rotation += p.vRot
        p.alpha -= 0.012
        if (p.alpha <= 0) continue
        active = true
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5)
        ctx.restore()
      }

      if (active) {
        animationId = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
        animationId = null
      }
    }

    render()
  }

  return { startOfflineConfetti }
}
