/**
 * 取得 public/ 目錄下靜態素材的正確路徑
 * 依 vite.config.js 的 base 設定自動加上前綴，確保在子路徑部署或離線開啟時仍能正確載入
 * @param {string} path 例如 'icon.png'、'videos/tuition.mp4'
 */
export function asset(path) {
  const base = import.meta.env.BASE_URL || '/'
  const clean = String(path).replace(/^\.?\//, '')
  return `${base}${clean}`
}

