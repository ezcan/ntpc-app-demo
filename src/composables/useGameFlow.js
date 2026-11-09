import { ref, computed, onUnmounted } from 'vue'
import { KIOSK_QUESTS } from '../data/quests'
import { MODULE_MAP, PHONE_MODULES } from '../data/phoneModules'
import { GAME_CONFIG } from '../data/gameConfig'

/**
 * 單題體驗狀態機
 *
 *   waiting ──點錯──▶ wrong ──點錯──▶ wrong
 *      │                 │
 *      └──點對──▶ correct ◀──點對──┘
 *                    │（倒數結束 / 按「下一位」）
 *                    ▼
 *                 waiting（隨機換一題）
 *
 * 任何時刻只會處於一種狀態，避免「尚未作答」與「答對」同時出現。
 */
export function useGameFlow() {
  const phase = ref('waiting') // 'waiting' | 'wrong' | 'correct'
  const questIndex = ref(pickIndex(-1))
  const lastWrongKey = ref('')
  const triedKeys = ref([]) // 本輪已點過的錯誤功能
  const wrongPulse = ref(0) // 每次點錯 +1，用來重新觸發動畫
  const countdown = ref(0)

  // 開發／展前檢視：支援以網址參數指定題目與狀態，例如 ?q=exchange&phase=wrong&wrong=grades
  if (typeof window !== 'undefined' && window.location.search) {
    const params = new URLSearchParams(window.location.search)
    const qId = params.get('q')
    const idx = KIOSK_QUESTS.findIndex((q) => q.id === qId)
    if (idx >= 0) questIndex.value = idx
    const p = params.get('phase')
    if (p === 'wrong') {
      const wk = params.get('wrong') || 'grades'
      phase.value = 'wrong'
      lastWrongKey.value = wk
      triedKeys.value = [wk]
    } else if (p === 'correct') {
      phase.value = 'correct'
      countdown.value = GAME_CONFIG.resultSeconds
    }
  }

  let tickTimer = null
  let idleSeconds = 0

  const quest = computed(() => KIOSK_QUESTS[questIndex.value])
  const lastWrongModule = computed(() => MODULE_MAP[lastWrongKey.value] || null)
  const answerModule = computed(() => MODULE_MAP[quest.value.targetKey])

  function pickIndex(exclude) {
    if (KIOSK_QUESTS.length <= 1) return 0
    let i
    do {
      i = Math.floor(Math.random() * KIOSK_QUESTS.length)
    } while (i === exclude)
    return i
  }

  /** 民眾點選手機功能。回傳 'correct' | 'wrong' | null（不接受輸入時） */
  function select(key) {
    idleSeconds = 0
    if (phase.value === 'correct') return null

    if (key === quest.value.targetKey) {
      phase.value = 'correct'
      lastWrongKey.value = ''
      countdown.value = GAME_CONFIG.resultSeconds
      return 'correct'
    }

    phase.value = 'wrong'
    lastWrongKey.value = key
    if (!triedKeys.value.includes(key)) triedKeys.value.push(key)
    wrongPulse.value += 1
    return 'wrong'
  }

  /** 進入下一輪：隨機換題並回到待機狀態 */
  function resetRound() {
    questIndex.value = pickIndex(questIndex.value)
    phase.value = 'waiting'
    lastWrongKey.value = ''
    triedKeys.value = []
    countdown.value = 0
    idleSeconds = 0
  }

  /** 預覽工具專用：直接指定題目 */
  function selectQuestById(id) {
    const idx = KIOSK_QUESTS.findIndex((q) => q.id === id)
    if (idx >= 0) {
      questIndex.value = idx
      phase.value = 'waiting'
      lastWrongKey.value = ''
      triedKeys.value = []
      countdown.value = 0
      idleSeconds = 0
    }
  }

  /** 預覽工具專用：直接切換狀態 */
  function setPreviewPhase(targetPhase) {
    idleSeconds = 0
    if (targetPhase === 'waiting') {
      phase.value = 'waiting'
      lastWrongKey.value = ''
      triedKeys.value = []
      countdown.value = 0
    } else if (targetPhase === 'wrong') {
      const sampleWrong = PHONE_MODULES.find((m) => m.key !== quest.value.targetKey)
      const wk = sampleWrong ? sampleWrong.key : 'grades'
      phase.value = 'wrong'
      lastWrongKey.value = wk
      if (!triedKeys.value.includes(wk)) triedKeys.value.push(wk)
      wrongPulse.value += 1
    } else if (targetPhase === 'correct') {
      phase.value = 'correct'
      lastWrongKey.value = ''
      countdown.value = GAME_CONFIG.resultSeconds
    }
  }

  /** 任何觸碰都視為「有人正在使用」 */
  function notifyActivity() {
    idleSeconds = 0
    if (phase.value === 'correct') {
      countdown.value = Math.max(countdown.value, GAME_CONFIG.resultTouchExtendSeconds)
    }
  }

  function tick() {
    if (phase.value === 'correct') {
      countdown.value -= 1
      if (countdown.value <= 0) resetRound()
      return
    }
    idleSeconds += 1
    const limit = phase.value === 'wrong' ? GAME_CONFIG.wrongIdleSeconds : GAME_CONFIG.waitingIdleSeconds
    if (idleSeconds >= limit) resetRound()
  }

  function start() {
    stop()
    tickTimer = setInterval(tick, 1000)
  }

  function stop() {
    if (tickTimer) clearInterval(tickTimer)
    tickTimer = null
  }

  onUnmounted(stop)

  return {
    phase,
    quest,
    answerModule,
    lastWrongKey,
    lastWrongModule,
    triedKeys,
    wrongPulse,
    countdown,
    resultSeconds: GAME_CONFIG.resultSeconds,
    select,
    resetRound,
    selectQuestById,
    setPreviewPhase,
    notifyActivity,
    start,
    stop
  }
}
