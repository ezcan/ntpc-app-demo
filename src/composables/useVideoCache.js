import { reactive, ref, computed } from 'vue'
import { KIOSK_QUESTS } from '../data/quests'
import { asset } from '../utils/asset'

const OLD_CACHE_NAMES = [
  'ntpc-kiosk-video-cache-v1',
  'ntpc-kiosk-video-cache-v2',
  'ntpc-kiosk-video-cache-v3'
]
const CACHE_NAME = 'ntpc-kiosk-video-cache-v4'

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
   * - 初次載入或重整頁面：使用 fetch(videoSrc, { cache: 'no-cache' }) 透過 ETag/Last-Modified 確認是否為最新影片檔（若替換同名影片檔也能立即更新），並寫入 CacheStorage 供離線備援
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

      // 1. 優先向伺服器確認最新影片（支援 ETag 304 快速驗證；若替換了同名 .mp4 也能立即抓取新版）
      try {
        const netRes = await fetch(videoSrc, { cache: 'no-cache' })
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
      } catch {
        // 2. 若處於完全離線環境，從 CacheStorage 讀取離線備援
        if ('caches' in window) {
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
   * 展場背景批次預載：優先載入當前題目，再依序快取其餘 8 題影片
   */
  async function preloadAllVideos(priorityQuestId = null) {
    if (isPreloading.value) return
    isPreloading.value = true

    try {
      await cleanupOldCaches()
      const quests = [...KIOSK_QUESTS]
      if (priorityQuestId) {
        quests.sort((a, b) => (a.id === priorityQuestId ? -1 : b.id === priorityQuestId ? 1 : 0))
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
