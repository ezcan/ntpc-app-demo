import { reactive, ref, computed } from 'vue'
import { KIOSK_QUESTS } from '../data/quests'
import { asset } from '../utils/asset'

const OLD_CACHE_NAMES = [
  'ntpc-kiosk-video-cache-v1',
  'ntpc-kiosk-video-cache-v2',
  'ntpc-kiosk-video-cache-v3',
  'ntpc-kiosk-video-cache-v4'
]
const CACHE_NAME = 'ntpc-kiosk-video-cache-v5'

// 單例狀態：跨組件共享影片快取與預載進度
const blobUrlMap = reactive({})
const statusMap = reactive({}) // 'idle' | 'loading' | 'cached' | 'missing'
const isPreloading = ref(false)
const isVideoMuted = ref(true) // 預設靜音確保 100% 通過瀏覽器自動播放限制，使用者可一鍵開啟聲音

/**
 * 檢查 Response 是否為真實影片檔案（排除 Vite SPA fallback 回傳的 text/html）
 */
function isValidVideoResponse(res) {
  if (!res || !res.ok) return false
  const contentType = (res.headers.get('content-type') || '').toLowerCase()
  if (contentType.includes('text/html')) return false
  return contentType.includes('video/') || contentType.includes('application/octet-stream')
}

export function useVideoCache() {
  /**
   * 清理舊版快取
   */
  async function cleanupOldCaches() {
    if (!('caches' in window)) return
    try {
      for (const oldName of OLD_CACHE_NAMES) {
        await caches.delete(oldName)
      }
    } catch {
      // ignore
    }
  }

  /**
   * 檢查並預載單一題目影片：
   * - 同次瀏覽期間：直接使用記憶體 Blob URL (blobUrlMap)，切換題目 0ms 零延遲
   * - 優先檢查瀏覽器 CacheStorage 本地快取，命中時免網路下載直接轉為 Blob
   * - 未命中時以標準 HTTP 快取 (cache: 'default') 背景下載並寫入 CacheStorage
   */
  async function preloadQuestVideo(quest, forceRefresh = false) {
    if (!quest || !quest.videoSrc) return null
    const { id } = quest
    const videoSrc = asset(quest.videoSrc)

    if (!forceRefresh && statusMap[id] === 'cached' && blobUrlMap[id]) {
      return blobUrlMap[id]
    }
    if (statusMap[id] === 'loading') {
      return null
    }

    statusMap[id] = 'loading'

    try {
      let response = null

      // 1. 優先從 CacheStorage 讀取已快取的影片（秒開免重抓）
      if (!forceRefresh && 'caches' in window) {
        try {
          const cache = await caches.open(CACHE_NAME)
          const cachedRes = await cache.match(videoSrc)
          if (isValidVideoResponse(cachedRes)) {
            response = cachedRes
          }
        } catch {
          // ignore
        }
      }

      // 2. 若本地尚未快取，透過 CDN 標準快取下載並寫入 CacheStorage
      if (!response) {
        const netRes = await fetch(videoSrc, { cache: 'default' })
        if (isValidVideoResponse(netRes)) {
          response = netRes
          if ('caches' in window) {
            try {
              const cache = await caches.open(CACHE_NAME)
              await cache.put(videoSrc, netRes.clone())
            } catch {
              // ignore cache write quota error
            }
          }
        }
      }

      if (!response) {
        statusMap[id] = 'missing'
        return null
      }

      const blob = await response.blob()
      // 影片檔至少應大於 10KB，避免誤將空白或錯誤訊息當成影片
      if (blob.size < 10240 || blob.type.includes('text/html')) {
        statusMap[id] = 'missing'
        return null
      }

      if (blobUrlMap[id]) {
        URL.revokeObjectURL(blobUrlMap[id])
      }
      const objectUrl = URL.createObjectURL(blob)
      blobUrlMap[id] = objectUrl
      statusMap[id] = 'cached'
      return objectUrl
    } catch {
      statusMap[id] = 'missing'
      return null
    }
  }

  /**
   * 展場背景批次預載：
   * 首題已由 <video> 原生 Range 串流直接播放，背景預載先載入「下一題與其他題目」，
   * 避免與首屏圖片及當前串流影片爭搶頻寬，最後才將當前題目收入快取。
   */
  async function preloadAllVideos(activeQuestId = null) {
    if (isPreloading.value) return
    isPreloading.value = true

    try {
      await cleanupOldCaches()
      const quests = [...KIOSK_QUESTS]
      if (activeQuestId) {
        quests.sort((a, b) => (a.id === activeQuestId ? 1 : b.id === activeQuestId ? -1 : 0))
      }

      for (const quest of quests) {
        await preloadQuestVideo(quest)
      }
    } finally {
      isPreloading.value = false
    }
  }

  /**
   * 取得題目實際可播放的影片 URL（優先使用快取 Blob URL）
   */
  function getVideoUrl(quest) {
    if (!quest) return ''
    return blobUrlMap[quest.id] || ''
  }

  /**
   * 取得特定題目的影片快取狀態
   */
  function getVideoStatus(questId) {
    return statusMap[questId] || 'idle'
  }

  /**
   * 智慧型自動播放處理：
   * 解決瀏覽器 Autoplay Policy 阻擋問題（若未解鎖音訊或遭阻擋，自動降級為靜音播放，確保展場畫面絕不卡住）
   */
  async function safeAutoPlay(videoEl) {
    if (!videoEl) return false
    try {
      videoEl.muted = isVideoMuted.value
      await videoEl.play()
      return true
    } catch {
      try {
        isVideoMuted.value = true
        videoEl.muted = true
        await videoEl.play()
        return true
      } catch {
        return false
      }
    }
  }

  function toggleVideoMute() {
    isVideoMuted.value = !isVideoMuted.value
  }

  const cachedCount = computed(() =>
    KIOSK_QUESTS.filter((q) => statusMap[q.id] === 'cached').length
  )

  const totalCount = computed(() => KIOSK_QUESTS.length)

  return {
    blobUrlMap,
    statusMap,
    isPreloading,
    isVideoMuted,
    cachedCount,
    totalCount,
    preloadQuestVideo,
    preloadAllVideos,
    getVideoUrl,
    getVideoStatus,
    safeAutoPlay,
    toggleVideoMute
  }
}
