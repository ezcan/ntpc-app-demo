<template>
  <div
    class="viewport-shell"
    :class="{ 'kiosk-bezel-mode': isBezelMode }"
    @pointerdown.capture="onAnyTouch"
    @contextmenu.prevent
  >
    <!-- 筆電開發／展前預覽控制列（點選右上角「🖥 預覽工具」展開，方便在沒有 85 吋大屏時快速測試 9 題與影片） -->
    <div v-if="showPreviewBar" class="preview-toolbar">
      <div class="preview-group">
        <span class="preview-label">切換題目：</span>
        <button
          v-for="q in allQuests"
          :key="q.id"
          class="preview-chip"
          :class="{ active: quest.id === q.id }"
          @click="selectQuestById(q.id)"
        >
          <span>{{ getModuleName(q.targetKey) }}</span>
          <span v-if="statusMap[q.id] === 'cached'" title="已載入影片">🎬</span>
        </button>
      </div>

      <div class="preview-group">
        <span class="preview-label">狀態預覽：</span>
        <button
          class="preview-chip"
          :class="{ active: phase === 'waiting' }"
          @click="setPreviewPhase('waiting')"
        >A 等待</button>
        <button
          class="preview-chip"
          :class="{ active: phase === 'wrong' }"
          @click="setPreviewPhase('wrong')"
        >B 答錯</button>
        <button
          class="preview-chip"
          :class="{ active: phase === 'correct' }"
          @click="setPreviewPhase('correct')"
        >C 答對</button>
        <button
          class="preview-chip bezel-chip"
          :class="{ active: isBezelMode }"
          @click="toggleBezelMode"
        >
          {{ isBezelMode ? '🔲 85吋電視外框模擬中' : '⛶ 滿版適應筆電' }}
        </button>
      </div>
    </div>

    <!-- 1920×1080 (16:9) 固定設計舞台，等比縮放填滿任何筆電或 85 吋螢幕 -->
    <div class="stage" :style="stageStyle">
      <KioskHeader
        class="area-header"
        :show-preview-bar="showPreviewBar"
        @toggle-preview="togglePreviewBar"
      />

      <BrandPanel class="area-brand" :highlight="phase === 'correct'" />

      <div class="area-center">
        <ScenarioPanel
          :phase="phase"
          :quest="quest"
          :wrong-module="lastWrongModule"
          :answer-module="answerModule"
          :wrong-pulse="wrongPulse"
        />
        <StatusStrip
          :phase="phase"
          :countdown="countdown"
          :total="resultSeconds"
          @next="goNext"
        />
      </div>

      <PhoneMockup
        class="area-phone"
        :phase="phase"
        :target-key="quest.targetKey"
        :wrong-key="lastWrongKey"
        :tried-keys="triedKeys"
        :wrong-pulse="wrongPulse"
        @select="onSelect"
      />

      <!-- 85 吋大屏實體尺寸標尺（僅在開啟 85 吋外框模擬時顯示） -->
      <div v-if="isBezelMode" class="bezel-info-tag">
        85 吋 16:9 觸控大屏模擬（188.2 cm × 105.8 cm｜1920 × 1080 px｜目前筆電縮放比 {{ Math.round(scale * 100) }}%）
      </div>
    </div>

    <canvas ref="confettiCanvasRef" class="confetti-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { KIOSK_QUESTS } from './data/quests'
import { MODULE_MAP } from './data/phoneModules'
import { useGameFlow } from './composables/useGameFlow'
import { useAudioSfx } from './composables/useAudioSfx'
import { useConfetti } from './composables/useConfetti'
import { useVideoCache } from './composables/useVideoCache'

import KioskHeader from './components/KioskHeader.vue'
import BrandPanel from './components/BrandPanel.vue'
import ScenarioPanel from './components/ScenarioPanel.vue'
import StatusStrip from './components/StatusStrip.vue'
import PhoneMockup from './components/PhoneMockup.vue'

const STAGE_W = 1920
const STAGE_H = 1080

const allQuests = KIOSK_QUESTS

const {
  phase,
  quest,
  answerModule,
  lastWrongKey,
  lastWrongModule,
  triedKeys,
  wrongPulse,
  countdown,
  resultSeconds,
  select,
  resetRound,
  selectQuestById,
  setPreviewPhase,
  notifyActivity,
  start
} = useGameFlow()

const { playTapSFX, playCorrectSFX, playWrongSFX, unlockAudio } = useAudioSfx()
const { startOfflineConfetti } = useConfetti()
const { statusMap, preloadAllVideos } = useVideoCache()

const confettiCanvasRef = ref(null)
const showPreviewBar = ref(false)
const isBezelMode = ref(false)

function getModuleName(key) {
  return MODULE_MAP[key]?.name || key
}

/* ---------- 舞台等比縮放 ---------- */
const scale = ref(1)
const stageOffsetY = ref(0)

function fitStage() {
  const topBarH = showPreviewBar.value ? 52 : 0
  const pad = isBezelMode.value ? 48 : 0
  const availW = Math.max(320, window.innerWidth - pad * 2)
  const availH = Math.max(240, window.innerHeight - topBarH - pad * 2)
  scale.value = Math.min(availW / STAGE_W, availH / STAGE_H)
  stageOffsetY.value = topBarH / 2
}

const stageStyle = computed(() => ({
  transform: `translate(-50%, calc(-50% + ${stageOffsetY.value}px)) scale(${scale.value})`
}))

async function togglePreviewBar() {
  showPreviewBar.value = !showPreviewBar.value
  if (!showPreviewBar.value) {
    isBezelMode.value = false
  }
  await nextTick()
  fitStage()
}

async function toggleBezelMode() {
  isBezelMode.value = !isBezelMode.value
  await nextTick()
  fitStage()
}

/* ---------- 互動 ---------- */
function onAnyTouch() {
  unlockAudio()
  notifyActivity()
}

function onSelect(key, origin) {
  const result = select(key)
  if (result === 'correct') {
    playCorrectSFX()
    startOfflineConfetti(confettiCanvasRef.value, origin)
  } else if (result === 'wrong') {
    playWrongSFX()
  }
}

function goNext() {
  playTapSFX()
  resetRound()
}

onMounted(() => {
  fitStage()
  window.addEventListener('resize', fitStage)
  start()
  // 背景預載全部題目影片（優先目前題目）；未放影片時自動使用情境插圖
  preloadAllVideos(quest.value.id)
})

onUnmounted(() => {
  window.removeEventListener('resize', fitStage)
})
</script>

<style>
.viewport-shell {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0f172a;
}

.viewport-shell.kiosk-bezel-mode {
  background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
}

/* 筆電預覽測試工具列 */
.preview-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  overflow-x: auto;
}

.preview-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.preview-label {
  font-size: 13px;
  font-weight: 800;
  color: #94a3b8;
  margin-right: 2px;
}

.preview-chip {
  height: 32px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.preview-chip:hover {
  background: rgba(255, 255, 255, 0.18);
}

.preview-chip.active {
  background: #0ea5e9;
  border-color: #38bdf8;
  color: #ffffff;
}

.preview-chip.bezel-chip.active {
  background: #10b981;
  border-color: #34d399;
}

.stage {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  padding: 20px 28px;
  display: grid;
  /* 左 13% 品牌 (244px)｜中 48.5% 情境 (1fr = 904px)｜右 36.5% 手機 (676px) */
  grid-template-columns: 244px minmax(0, 1fr) 676px;
  grid-template-rows: 92px minmax(0, 1fr);
  grid-template-areas:
    'header header header'
    'brand  center phone';
  gap: 18px 20px;
  background: url('/back-1920.jpg') center / cover no-repeat;
  touch-action: manipulation;
  overflow: hidden;
}

.kiosk-bezel-mode .stage {
  border-radius: 18px;
  box-shadow:
    0 0 0 14px #1e293b,
    0 0 0 17px #475569,
    0 30px 80px rgba(0, 0, 0, 0.65);
}

.bezel-info-tag {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.82);
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 14px;
  border-radius: 999px;
  pointer-events: none;
}

.area-header { grid-area: header; }
.area-brand { grid-area: brand; min-height: 0; }
.area-phone { grid-area: phone; min-height: 0; }

.area-center {
  grid-area: center;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.confetti-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}
</style>
